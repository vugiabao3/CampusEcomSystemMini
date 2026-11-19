namespace CampusEcomSystemMini.Application.Admin.Reports;

// Chi tiết một báo cáo cho Admin:
// report, người báo, chủ bài đăng và bài đăng bị báo.
public record GetAdminReportDetailResponse(
    Guid Id,
    Guid PostId,
    string PostTitle,
    string PostContent,
    Guid PostUserId,
    string PostUserName,
    Guid ReporterId,
    string ReporterName,
    string Reason,
    string? Description,
    string Status,
    DateTime CreatedAt,
    DateTime? ReviewedAt,
    Guid? ReviewedBy
);