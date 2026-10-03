using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class LostFoundRepository : ILostFoundRepository
{
    private readonly AppDbContext _context;

    public LostFoundRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LostFoundRecord?> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken)
    {
        return await _context.LostFoundRecords
            .FirstOrDefaultAsync(
                x => x.PostId == postId,
                cancellationToken);
    }

    public async Task<List<LostFoundRecord>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _context.LostFoundRecords
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        LostFoundRecord record,
        CancellationToken cancellationToken)
    {
        await _context.LostFoundRecords.AddAsync(
            record,
            cancellationToken);
    }

    public void UpdateAsync(
        LostFoundRecord record,
        CancellationToken cancellationToken)
    {
        _context.LostFoundRecords.Update(record);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}