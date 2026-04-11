using Application.DTOs.Authorize;
using Application.DTOs.User;

namespace Application.Interfaces
{
    public interface IAuthorizeService
    {
        Task<AuthResponse?> LoginAsync(LoginDto dto);
        Task<AuthResponse?> RefreshTokenAsync(string refreshToken);
        Task<bool> LogoutAsync(string refreshToken);
        Task<(bool Success, string[] Errors)> RegisterAsync(RegisterDto dto);
    }
}
