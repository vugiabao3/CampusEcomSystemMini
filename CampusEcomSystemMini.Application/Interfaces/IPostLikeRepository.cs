using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IPostLikeRepository
{
    Task<PostLike?> GetByPostAndUserAsync(
        Guid postId,
        Guid userId,
        CancellationToken cancellationToken);

    Task<List<PostLike>> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken);

    Task AddAsync(
        PostLike postLike,
        CancellationToken cancellationToken);

    void Remove(
        PostLike postLike);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}