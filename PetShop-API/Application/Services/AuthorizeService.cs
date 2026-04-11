using Application.DTOs.Authorize;
using Application.DTOs.User;
using Application.Interfaces;
using Domain.Entities.Authorizes;
using Infrastructure.Data;
using Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Application.Services
{
    public class AuthorizeService : IAuthorizeService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly AuthorizeDbContext _context;

        public AuthorizeService(
            UserManager<ApplicationUser> userManager,
            IConfiguration config,
            AuthorizeDbContext context
        )
        {
            _userManager = userManager;
            _config = config;
            _context = context;
        }

        public async Task<AuthResponse?> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return null;

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
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return (false, result.Errors.Select(e => e.Description).ToArray());
            }
            await _userManager.AddToRoleAsync(user, "Customer");

            return (true, Array.Empty<string>());
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
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
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
                UserId = userId
            };
        }
    }
}
