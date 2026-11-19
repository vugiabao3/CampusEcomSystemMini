using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class WarningRepository : IWarningRepository
{
    private readonly AppDbContext _context;

    public WarningRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Warning>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.Warnings
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.IssuedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Warning warning,
        CancellationToken cancellationToken)
    {
        await _context.Warnings.AddAsync(warning, cancellationToken);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
