using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IPreferenceRepository
{
    Task<Preference?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task<List<Preference>> GetAllAsync(
        CancellationToken cancellationToken);

    Task AddAsync(
        Preference preference,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Preference preference,
        CancellationToken cancellationToken);

    void Remove(
        Preference preference);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}