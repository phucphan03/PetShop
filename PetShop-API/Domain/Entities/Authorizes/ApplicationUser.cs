using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Authorizes
{
    public class ApplicationUser : IdentityUser
    {
        public required string FullName { get; set; }
        public string? CurrentOTP { get; set; }
        public DateTime? OTPExpiresAt { get; set; }
        public DateTime? LastOTPSentAt { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public ICollection<RefreshToken>? RefreshTokens { get; set; }
    }
}
