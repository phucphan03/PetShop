using Application.DTOs.Authorize;
using Application.DTOs.User;
using Application.FacadeService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizesController : ControllerBase
    {
        private readonly IFacadeService _facadeService;

        public AuthorizesController(IFacadeService facadeService)
        {
            _facadeService = facadeService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _facadeService.AuthorizeService.LoginAsync(dto);

            if (result == null)
                return Unauthorized();

            SetRefreshTokenCookie(result.RefreshToken);

            return Ok(new { accessToken = result.AccessToken });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized();

            var result = await _facadeService.AuthorizeService.RefreshTokenAsync(refreshToken);

            if (result == null)
                return Unauthorized();

            SetRefreshTokenCookie(result.RefreshToken);

            return Ok(new { accessToken = result.AccessToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _facadeService.AuthorizeService.LogoutAsync(refreshToken);
            }

            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
             var (success, errors) = await _facadeService.AuthorizeService.RegisterAsync(dto);

            if (!success)
            {
                return BadRequest(new { errors });
            }

            return Ok(new { message = "Đăng ký thành công" });
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDto dto)
        {
            await _facadeService.AuthorizeService.VerifyOtpAsync(dto);
            return Ok(new { message = "Xác thực OTP thành công" });
        }

        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp(ResendOtpDto dto)
        {
            await _facadeService.AuthorizeService.ResendOtpAsync(dto);
            return Ok(new { message = "OTP_SENT" });
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7),
            };

            Response.Cookies.Append("refreshToken", refreshToken, options);
        }
    }
}
