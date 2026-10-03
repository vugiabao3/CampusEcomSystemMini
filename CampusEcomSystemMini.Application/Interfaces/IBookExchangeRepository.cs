using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IBookExchangeRepository
{
    // search khớp vào BookName hoặc WantedBookName,
    // status lọc theo trạng thái bài đăng.
    // Cả hai đều không bắt buộc.
    Task<List<BookExchangePost>> GetAllAsync(
        string? search,
        string? status,
        CancellationToken cancellationToken);

    Task<List<BookExchangePost>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task<BookExchangePost?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    Task AddAsync(
        BookExchangePost post,
        CancellationToken cancellationToken);

    void UpdateAsync(
        BookExchangePost post,
        CancellationToken cancellationToken);

    void Remove(
        BookExchangePost post);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
