using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Reports;

// POST /api/reports
// Người dùng báo cáo một bài đăng.
// ReporterId lấy từ ICurrentUserService, không nhận từ frontend.
public record CreateReportCommand(
    Guid PostId,

    [Required] string Reason,

    string? Description
) : IRequest<CreateReportResponse?>;