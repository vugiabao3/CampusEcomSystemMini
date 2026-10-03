namespace CampusEcomSystemMini.Domain.Entities;

public class User
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? AvatarUrl { get; set; }

    public string Role { get; set; } = "User";

    // Điểm uy tín hiện tại (MODULE_6 Gamification).
    // Được cập nhật qua Gamification use case, mặc định 0.
    public int ReputationPoints { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}