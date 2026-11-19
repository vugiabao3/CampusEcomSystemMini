namespace CampusEcomSystemMini.Application.Reports;

// Báo cáo vừa tạo, trạng thái luôn là Pending.
public record CreateReportResponse(
    Guid Id,
    Guid PostId,
    Guid ReporterId,
    string Reason,
    string? Description,
    string Status,
    DateTime CreatedAt
);