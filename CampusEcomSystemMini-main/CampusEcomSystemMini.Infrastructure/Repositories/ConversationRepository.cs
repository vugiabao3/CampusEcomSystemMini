using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class ConversationRepository
    : IConversationRepository
{
    private readonly AppDbContext _context;

    public ConversationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Conversation?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Conversations
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    // Các cuộc trò chuyện có người dùng là participant.
    public async Task<List<Conversation>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var conversationIds = await _context.ConversationParticipants
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => x.ConversationId)
            .ToListAsync(cancellationToken);

        if (!conversationIds.Any())
        {
            return [];
        }

        return await _context.Conversations
            .AsNoTracking()
            .Where(x => conversationIds.Contains(x.Id))
            .ToListAsync(cancellationToken);
    }

    // Cuộc trò chuyện 1-1 giữa hai người dùng (nếu đã có).
    public async Task<Conversation?> GetBetweenUsersAsync(
        Guid firstUserId,
        Guid secondUserId,
        CancellationToken cancellationToken)
    {
        var firstUserConversationIds =
            await _context.ConversationParticipants
                .AsNoTracking()
                .Where(x => x.UserId == firstUserId)
                .Select(x => x.ConversationId)
                .ToListAsync(cancellationToken);

        if (!firstUserConversationIds.Any())
        {
            return null;
        }

        var sharedConversationIds =
            await _context.ConversationParticipants
                .AsNoTracking()
                .Where(x =>
                    x.UserId == secondUserId &&
                    firstUserConversationIds.Contains(x.ConversationId))
                .Select(x => x.ConversationId)
                .ToListAsync(cancellationToken);

        return await _context.Conversations
            .Where(x => sharedConversationIds.Contains(x.Id))
            .OrderBy(x => x.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task AddAsync(
        Conversation conversation,
        CancellationToken cancellationToken)
    {
        await _context.Conversations.AddAsync(
            conversation,
            cancellationToken);
    }

    public void UpdateAsync(
        Conversation conversation,
        CancellationToken cancellationToken)
    {
        _context.Conversations.Update(conversation);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
