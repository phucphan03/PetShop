using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Authorizes
{
    public class ApplicationUser : IdentityUser
    {
        public required string FullName { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public ICollection<RefreshToken>? RefreshTokens { get; set; }
    }
}
