namespace CampusEcomSystemMini.Application.Admin.Reports;

// Một dòng trong hàng đợi báo cáo của Admin.
public record GetAdminReportsResponse(
    Guid Id,
    Guid PostId,
    string PostTitle,
    Guid ReporterId,
    string ReporterName,
    string Reason,
    string? Description,
    string Status,
    DateTime CreatedAt
);