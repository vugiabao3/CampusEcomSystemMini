using MediatR;

namespace CampusEcomSystemMini.Application.Reports;

// GET /api/reports/me
// Chỉ lấy báo cáo của chính người đang đăng nhập.
public record GetMyReportsQuery : IRequest<List<GetMyReportsResponse>>;