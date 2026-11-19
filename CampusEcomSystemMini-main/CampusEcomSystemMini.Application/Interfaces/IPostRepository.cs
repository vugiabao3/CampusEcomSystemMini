using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IPostRepository
{
    Task<List<Post>> GetAllAsync(
        string? type,
        DateTime? createdFromUtc,
        DateTime? createdToUtc,
        CancellationToken cancellationToken,
        bool includeHidden = false,
        bool includeDeleted = false);

    Task<List<Post>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task<Post?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    // Lấy nhiều bài đăng theo danh sách Id trong một truy vấn.
    // Dùng khi cần tiêu đề của các bài đăng liên quan.
    Task<List<Post>> GetByIdsAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken);

    Task AddAsync(
        Post post,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Post post,
        CancellationToken cancellationToken);

    void Remove(
        Post post);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}