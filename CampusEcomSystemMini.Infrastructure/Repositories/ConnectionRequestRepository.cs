using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class ConnectionRequestRepository
    : IConnectionRequestRepository
{
    private readonly AppDbContext _context;

    public ConnectionRequestRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ConnectionRequest?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.ConnectionRequests
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    // Yêu cầu nhận được, mới nhất trước.
    public async Task<List<ConnectionRequest>> GetByReceiverIdAsync(
        Guid receiverId,
        CancellationToken cancellationToken)
    {
        return await _context.ConnectionRequests
            .AsNoTracking()
            .Where(x => x.ReceiverId == receiverId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    // Yêu cầu đã gửi, mới nhất trước.
    public async Task<List<ConnectionRequest>> GetBySenderIdAsync(
        Guid senderId,
        CancellationToken cancellationToken)
    {
        return await _context.ConnectionRequests
            .AsNoTracking()
            .Where(x => x.SenderId == senderId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    // Yêu cầu Pending trùng giữa hai người dùng.
    public async Task<ConnectionRequest?> GetPendingAsync(
        Guid senderId,
        Guid receiverId,
        CancellationToken cancellationToken)
    {
        return await _context.ConnectionRequests
            .FirstOrDefaultAsync(
                x => x.SenderId == senderId &&
                     x.ReceiverId == receiverId &&
                     x.Status == "Pending",
                cancellationToken);
    }

    public async Task AddAsync(
        ConnectionRequest connectionRequest,
        CancellationToken cancellationToken)
    {
        await _context.ConnectionRequests.AddAsync(
            connectionRequest,
            cancellationToken);
    }

    public void UpdateAsync(
        ConnectionRequest connectionRequest,
        CancellationToken cancellationToken)
    {
        _context.ConnectionRequests.Update(connectionRequest);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
