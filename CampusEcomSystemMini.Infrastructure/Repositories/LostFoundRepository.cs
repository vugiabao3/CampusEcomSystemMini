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

    public async Task<List<LostFoundRecord>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _context.LostFoundRecords
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}