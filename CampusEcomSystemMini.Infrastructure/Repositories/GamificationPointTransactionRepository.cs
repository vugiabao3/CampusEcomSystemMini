using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class GamificationPointTransactionRepository
    : IGamificationPointTransactionRepository
{
    private readonly AppDbContext _context;

    public GamificationPointTransactionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GamificationPointTransaction>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        // Giao dịch mới nhất lên đầu.
        return await _context.GamificationPointTransactions
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        GamificationPointTransaction transaction,
        CancellationToken cancellationToken)
    {
        await _context.GamificationPointTransactions.AddAsync(
            transaction,
            cancellationToken);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
