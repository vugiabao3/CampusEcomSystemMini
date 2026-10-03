using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class NotificationRepository
    : INotificationRepository
{
    private readonly AppDbContext _context;

    public NotificationRepository(AppDbContext context)
    {
        _context = context;
    }

    // Thông báo của người dùng, mới nhất trước.
    public async Task<List<Notification>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.Notifications
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Notification?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Notifications
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    // Số thông báo chưa đọc của người dùng.
    public async Task<int> GetUnreadCountAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.Notifications
            .AsNoTracking()
            .CountAsync(
                x => x.UserId == userId && !x.IsRead,
                cancellationToken);
    }

    // Kiểm tra thông báo trùng (user + type + relatedId)
    // để không tạo notification trùng lặp.
    public async Task<bool> ExistsByUserAndRelatedIdAsync(
        Guid userId,
        string type,
        Guid relatedId,
        CancellationToken cancellationToken)
    {
        return await _context.Notifications
            .AsNoTracking()
            .AnyAsync(
                x => x.UserId == userId &&
                     x.Type == type &&
                     x.RelatedId == relatedId,
                cancellationToken);
    }

    public async Task AddAsync(
        Notification notification,
        CancellationToken cancellationToken)
    {
        await _context.Notifications.AddAsync(
            notification,
            cancellationToken);
    }

    public void UpdateAsync(
        Notification notification,
        CancellationToken cancellationToken)
    {
        _context.Notifications.Update(notification);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
