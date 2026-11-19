namespace CampusEcomSystemMini.Application.Admin.Reports;

public record ApproveReportResponse(
    Guid Id,
    string Status,
    DateTime? ReviewedAt,
    Guid? ReviewedBy
);

public enum ApproveReportOutcome
{
    Approved,
    ReportNotFound,
    AlreadyResolved
}

public record ApproveReportResult(
    ApproveReportOutcome Outcome,
    ApproveReportResponse? Response);