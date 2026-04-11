namespace Application.DTOs.Authorize
{
    public class RegisterDto
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public string ConfirmPassword { get; set; } = default!;
        public string FullName { get; set; } = default!;
    }
}
