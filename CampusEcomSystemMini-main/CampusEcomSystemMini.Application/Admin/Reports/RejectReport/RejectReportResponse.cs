namespace CampusEcomSystemMini.Application.Admin.Reports;

public record RejectReportResponse(
    Guid Id,
    string Status,
    DateTime? ReviewedAt,
    Guid? ReviewedBy
);

public enum RejectReportOutcome
{
    Rejected,
    ReportNotFound,
    AlreadyResolved
}

public record RejectReportResult(
    RejectReportOutcome Outcome,
    RejectReportResponse? Response);