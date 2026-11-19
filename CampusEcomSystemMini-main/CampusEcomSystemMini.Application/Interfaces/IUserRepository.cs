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

    // Lấy nhiều người dùng theo danh sách Id trong một truy vấn.
    // Dùng khi cần hiển thị tên/avatar của nhiều chủ bài đăng,
    // tránh gọi GetByIdAsync nhiều lần.
    Task<List<User>> GetByIdsAsync(
        IReadOnlyCollection<Guid> ids,
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