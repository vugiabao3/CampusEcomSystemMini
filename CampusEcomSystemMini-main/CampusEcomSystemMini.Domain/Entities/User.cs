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

    // Thời gian hết hạn khóa tạm thời (null = không bị khóa tạm).
    public DateTime? SuspensionExpiry { get; set; }

    // Admin thực hiện khóa tạm.
    public Guid? SuspendedBy { get; set; }

    // Lý do khóa tạm.
    public string? SuspensionReason { get; set; }

    // Thời điểm khóa tạm.
    public DateTime? SuspendedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}