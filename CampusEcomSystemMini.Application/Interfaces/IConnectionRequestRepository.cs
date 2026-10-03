using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IConnectionRequestRepository
{
    Task<ConnectionRequest?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    // Yêu cầu kết nối gửi đến người dùng đang đăng nhập.
    Task<List<ConnectionRequest>> GetByReceiverIdAsync(
        Guid receiverId,
        CancellationToken cancellationToken);

    // Yêu cầu kết nối người dùng đang đăng nhập đã gửi.
    Task<List<ConnectionRequest>> GetBySenderIdAsync(
        Guid senderId,
        CancellationToken cancellationToken);

    // Yêu cầu Pending trùng giữa hai người dùng.
    Task<ConnectionRequest?> GetPendingAsync(
        Guid senderId,
        Guid receiverId,
        CancellationToken cancellationToken);

    Task AddAsync(
        ConnectionRequest connectionRequest,
        CancellationToken cancellationToken);

    void UpdateAsync(
        ConnectionRequest connectionRequest,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
