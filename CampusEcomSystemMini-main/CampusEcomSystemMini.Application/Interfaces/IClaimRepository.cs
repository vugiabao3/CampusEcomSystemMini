using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IClaimRepository
{
    Task<Claim?> GetByIdAsync(
        Guid claimId,
        CancellationToken cancellationToken);

    Task<List<Claim>> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken);

    Task AddAsync(
        Claim claim,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Claim claim,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}