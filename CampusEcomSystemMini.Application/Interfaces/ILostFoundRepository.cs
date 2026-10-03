using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface ILostFoundRepository
{
    Task<LostFoundRecord?> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken);

    Task<List<LostFoundRecord>> GetAllAsync(
        CancellationToken cancellationToken);

    Task AddAsync(
        LostFoundRecord record,
        CancellationToken cancellationToken);

    void UpdateAsync(
        LostFoundRecord record,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}