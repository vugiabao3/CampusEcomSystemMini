using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface ISecretQuestionRepository
{
    Task<SecretQuestion?> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken);

    Task AddAsync(
        SecretQuestion secretQuestion,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}