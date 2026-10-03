namespace CampusEcomSystemMini.Domain.Entities;

using CampusEcomSystemMini.Domain.Enums;

public class User
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? AvatarUrl { get; set; }

    public string Role { get; set; } = "User";

    // Active / Blocked (MODULE_6 Admin).
    // Chỉ Admin đổi được trạng thái này.
    public string Status { get; set; } = UserStatus.Active;

    // Điểm uy tín hiện tại (MODULE_6 Gamification).
    // Được cập nhật qua GamificationService, mặc định 0.
    public int ReputationPoints { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}