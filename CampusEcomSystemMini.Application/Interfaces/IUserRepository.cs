using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken);


    Task<User?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    Task<List<User>> GetAllAsync(
        CancellationToken cancellationToken);

    Task AddAsync(
        User user,
        CancellationToken cancellationToken);

    void UpdateAsync(
        User user,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}