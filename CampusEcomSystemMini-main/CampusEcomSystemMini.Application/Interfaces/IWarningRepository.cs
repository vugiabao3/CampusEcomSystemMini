using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IWarningRepository
{
    Task<List<Warning>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task AddAsync(
        Warning warning,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
