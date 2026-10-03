using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IClaimRepository
{
    Task<List<Claim>> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken);

    Task AddAsync(
        Claim claim,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}