using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IReportRepository
{
    Task<Report?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    // Báo cáo của một người dùng, mới nhất lên đầu.
    Task<List<Report>> GetByReporterIdAsync(
        Guid reporterId,
        CancellationToken cancellationToken);

    // Toàn bộ hàng đợi báo cáo cho Admin, mới nhất lên đầu.
    Task<List<Report>> GetAllAsync(
        CancellationToken cancellationToken);

    Task AddAsync(
        Report report,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Report report,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}