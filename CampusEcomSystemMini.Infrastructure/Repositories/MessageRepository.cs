using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class MessageRepository
    : IMessageRepository
{
    private readonly AppDbContext _context;

    public MessageRepository(AppDbContext context)
    {
        _context = context;
    }

    // Lịch sử tin nhắn theo thứ tự thời gian tăng dần, có phân trang.
    public async Task<List<Message>> GetByConversationIdAsync(
        Guid conversationId,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var skip = (page - 1) * pageSize;

        return await _context.Messages
            .AsNoTracking()
            .Where(x => x.ConversationId == conversationId)
            .OrderBy(x => x.SentAt)
            .ThenBy(x => x.Id)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    // Tin nhắn mới nhất trong cuộc trò chuyện.
    public async Task<Message?> GetLastMessageAsync(
        Guid conversationId,
        CancellationToken cancellationToken)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(x => x.ConversationId == conversationId)
            .OrderByDescending(x => x.SentAt)
            .ThenByDescending(x => x.Id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    // Số tin nhắn gửi đến người dùng mà chưa đọc.
    public async Task<int> GetUnreadCountAsync(
        Guid conversationId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.Messages
            .AsNoTracking()
            .CountAsync(
                x => x.ConversationId == conversationId &&
                     x.SenderId != userId &&
                     !x.IsRead,
                cancellationToken);
    }

    public async Task AddAsync(
        Message message,
        CancellationToken cancellationToken)
    {
        await _context.Messages.AddAsync(
            message,
            cancellationToken);
    }

    public void UpdateAsync(
        Message message,
        CancellationToken cancellationToken)
    {
        _context.Messages.Update(message);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
