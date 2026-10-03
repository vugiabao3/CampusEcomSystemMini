namespace CampusEcomSystemMini.Application.Reports;

// Một báo cáo của người đang đăng nhập.
public record GetMyReportsResponse(
    Guid Id,
    Guid PostId,
    string Reason,
    string? Description,
    string Status,
    DateTime CreatedAt
);