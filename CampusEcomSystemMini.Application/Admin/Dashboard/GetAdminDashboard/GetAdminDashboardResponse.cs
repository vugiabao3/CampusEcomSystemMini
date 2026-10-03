namespace CampusEcomSystemMini.Application.Admin.Dashboard;

// Các con số tổng quan cho Admin Dashboard.
public record GetAdminDashboardResponse(
    int TotalUsers,
    int ActiveUsers,
    int TotalPosts,
    int PendingReports,
    int ResolvedReports,
    int TotalPoints
);