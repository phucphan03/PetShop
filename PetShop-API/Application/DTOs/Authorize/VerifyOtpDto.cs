namespace Application.DTOs.Authorize
{
    public class VerifyOtpDto
    {
        public required string Email { get; set; }
        public required string OTP { get; set; }
    }
}
