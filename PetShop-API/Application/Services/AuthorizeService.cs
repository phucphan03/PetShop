using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.DTOs.Authorize;
using Application.DTOs.User;
using Application.Interfaces;
using Domain.Entities.Authorizes;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shared.Email.Interface;
using Shared.Exceptions;

namespace Application.Services
{
    public class AuthorizeService : IAuthorizeService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly AuthorizeDbContext _context;
        private readonly IEmailQueue _emailQueue;
        private const string ACCOUNT_STR = "Account";

        public AuthorizeService(
            UserManager<ApplicationUser> userManager,
            IConfiguration config,
            AuthorizeDbContext context,
            IEmailQueue emailQueue
        )
        {
            _userManager = userManager;
            _config = config;
            _context = context;
            _emailQueue = emailQueue;
        }

        public async Task<AuthResponse?> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return null;

            if (!user.EmailConfirmed)
            {
                await SendOtpInternalAsync(user, "Login");
            }

            var accessToken = await GenerateAccessTokenAsync(user);
            var refreshToken = GenerateRefreshToken(user.Id);

            user.RefreshTokens ??= new List<RefreshToken>();
            user.RefreshTokens.Add(refreshToken);

            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
            };
        }

        public async Task<AuthResponse?> RefreshTokenAsync(string refreshToken)
        {
            var tokenInDb = await _context
                .RefreshTokens.Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Token == refreshToken);

            if (tokenInDb == null || tokenInDb.IsRevoked || tokenInDb.ExpiresAt < DateTime.UtcNow)
                return null;

            var newRefreshToken = GenerateRefreshToken(tokenInDb.UserId);

            tokenInDb.IsRevoked = true;
            tokenInDb.ReplacedByToken = newRefreshToken.Token;

            tokenInDb.User!.RefreshTokens!.Add(newRefreshToken);

            var newAccessToken = await GenerateAccessTokenAsync(tokenInDb.User);

            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token,
            };
        }

        public async Task<bool> LogoutAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(x =>
                x.Token == refreshToken
            );

            if (token == null)
                return false;

            token.IsRevoked = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<(bool Success, string[] Errors)> RegisterAsync(RegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
            {
                return (false, new[] { "Password và ConfirmPassword không khớp" });
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return (false, new[] { "Email đã tồn tại" });
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                EmailConfirmed = false,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return (false, result.Errors.Select(e => e.Description).ToArray());
            }

            await SendOtpInternalAsync(user, "Register");

            return (true, Array.Empty<string>());
        }

        public async Task VerifyOtpAsync(VerifyOtpDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new CustomValidationException(
                    new Dictionary<string, string[]> { { ACCOUNT_STR, new[] { "USER_NOT_FOUND" } } }
                );
            if (
                user.CurrentOTP != dto.OTP
                || !user.OTPExpiresAt.HasValue
                || user.OTPExpiresAt.Value < DateTime.UtcNow
            )
                throw new CustomValidationException(
                    new Dictionary<string, string[]>
                    {
                        { ACCOUNT_STR, new[] { "INVALID_OR_EXPIRED_OTP" } },
                    }
                );
            user.EmailConfirmed = true;
            user.CurrentOTP = null;
            user.OTPExpiresAt = null;
            await _userManager.UpdateAsync(user);
            await _userManager.AddToRoleAsync(user, "Customer");
        }

        public async Task ResendOtpAsync(ResendOtpDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new CustomValidationException(
                    new Dictionary<string, string[]> { { ACCOUNT_STR, new[] { "USER_NOT_FOUND" } } }
                );
            if (user.EmailConfirmed)
                throw new CustomValidationException(
                    new Dictionary<string, string[]>
                    {
                        { ACCOUNT_STR, new[] { "EMAIL_ALREADY_CONFIRMED" } },
                    }
                );

            var now = DateTime.UtcNow;
            if (user.LastOTPSentAt.HasValue && (now - user.LastOTPSentAt.Value).TotalSeconds < 60)
            {
                throw new CustomValidationException(
                    new Dictionary<string, string[]>
                    {
                        { "OTP", new[] { "PLEASE_WAIT_60_SECONDS" } },
                    }
                );
            }
            await Task.Delay(Random.Shared.Next(500, 1500));
            await SendOtpInternalAsync(user, "Register");
            user.LastOTPSentAt = now;
            await _userManager.UpdateAsync(user);
        }

        // ========================
        // PRIVATE METHODS
        // ========================

        private async Task<string> GenerateAccessTokenAsync(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.FullName ?? string.Empty),
            };

            var roles = await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private RefreshToken GenerateRefreshToken(string userId)
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                UserId = userId,
            };
        }

        private async Task SendOtpInternalAsync(ApplicationUser user, string purpose)
        {
            if (
                user.LastOTPSentAt.HasValue
                && DateTime.UtcNow < user.LastOTPSentAt.Value.AddSeconds(60)
            )
                throw new CustomValidationException(
                    new Dictionary<string, string[]>
                    {
                        { ACCOUNT_STR, new[] { "OTP_REQUEST_TOO_FREQUENT" } },
                    }
                );

            // Tạo OTP
            var otpBytes = new byte[4];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(otpBytes);
            var otp = BitConverter.ToUInt32(otpBytes, 0) % 1000000;
            user.CurrentOTP = otp.ToString("D6");
            user.OTPExpiresAt = DateTime.UtcNow.AddMinutes(5);
            user.LastOTPSentAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            // Gửi Email
            var subject =
                purpose == "Login"
                    ? "Đăng nhập PetShop: Mã xác minh 6 chữ số"
                    : "Đăng ký PetShop: Mã xác minh 6 chữ số";
            string purposeContent =
                purpose == "Login"
                    ? "Bạn đã yêu cầu mã xác minh để đăng nhập vào PetShop. Vui lòng nhập mã dưới đây để tiếp tục."
                    : "Cảm ơn bạn đã đăng ký PetShop! Vui lòng nhập mã xác minh dưới đây để hoàn tất quá trình đăng ký.";
            var htmlMessage =
                $"<table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: collapse; width: 100%; font-family: sans-serif; background-color: #fff5f0; padding: 20px;\">"
                + $"<tr><td align=\"center\">"
                + $"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; max-width: 600px; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(255, 140, 0, 0.1);\">"
                + $"<tr><td style=\"padding: 24px 32px;\">"
                + $"<div style=\"text-align: left;\">"
                + $"<img src=\"https://res.cloudinary.com/dl4idg6ey/image/upload/v1749266020/logoh_enlx7y.png\" alt=\"HomeCareDN\" style=\"height: 32px; filter: brightness(0) invert(1);\">"
                + $"</div>"
                + $"</td></tr>"
                + $"<tr><td style=\"padding: 32px;\">"
                + $"<p style=\"font-size: 18px; color: #2d2d2d; margin-bottom: 8px; font-weight: 600;\">Chào {user.FullName}!</p>"
                + $"<p style=\"font-size: 16px; color: #4a4a4a; margin-bottom: 28px; line-height: 1.5;\">{purposeContent}</p>"
                + $"<div style=\"background: linear-gradient(135deg, #fff5f0 0%, #ffe8d6 100%); border: 2px solid #ff8c00; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;\">"
                + $"<p style=\"font-size: 36px; font-weight: bold; color: #ff6600; margin: 0; letter-spacing: 6px; text-shadow: 0 2px 4px rgba(255, 102, 0, 0.1);\">{user.CurrentOTP}</p>"
                + $"</div>"
                + $"<div style=\"background-color: #fff5f0; border-left: 4px solid #ff8c00; border-radius: 0 8px 8px 0; padding: 16px; margin: 24px 0;\">"
                + $"<p style=\"font-size: 14px; color: #ff6600; margin: 0; font-weight: 500;\">⏰ Mã này sẽ hết hạn sau 5 phút.</p>"
                + $"</div>"
                + $"<p style=\"font-size: 14px; color: #888; margin-top: 20px;\">Bỏ qua email nếu bạn không yêu cầu mã này.</p>"
                + $"</td></tr>"
                + $"<tr><td style=\"padding: 20px 32px; background: linear-gradient(135deg, #ff8c00 0%, #ff7700 100%); font-size: 12px; color: white; text-align: center;\">"
                + $"<p style=\"margin: 0; opacity: 0.9;\">📍 Người gửi: HomeCareDN</p>"
                + $"<p style=\"margin: 4px 0 0 0; opacity: 0.8;\">Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng 550000</p>"
                + $"</td></tr>"
                + $"</table>"
                + $"</td></tr>"
                + $"</table>";

            if (!string.IsNullOrEmpty(user.Email))
                _emailQueue.QueueEmail(user.Email, subject, htmlMessage);
        }
    }
}
