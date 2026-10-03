using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class ConversationParticipantRepository
    : IConversationParticipantRepository
{
    private readonly AppDbContext _context;

    public ConversationParticipantRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ConversationParticipant>> GetByConversationIdAsync(
        Guid conversationId,
        CancellationToken cancellationToken)
    {
        return await _context.ConversationParticipants
            .AsNoTracking()
            .Where(x => x.ConversationId == conversationId)
            .ToListAsync(cancellationToken);
    }

    // Kiểm tra người dùng có phải participant của cuộc trò chuyện.
    public async Task<ConversationParticipant?> GetByConversationAndUserAsync(
        Guid conversationId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.ConversationParticipants
            .FirstOrDefaultAsync(
                x => x.ConversationId == conversationId &&
                     x.UserId == userId,
                cancellationToken);
    }

    public async Task AddAsync(
        ConversationParticipant participant,
        CancellationToken cancellationToken)
    {
        await _context.ConversationParticipants.AddAsync(
            participant,
            cancellationToken);
    }

    public void UpdateAsync(
        ConversationParticipant participant,
        CancellationToken cancellationToken)
    {
        _context.ConversationParticipants.Update(participant);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
