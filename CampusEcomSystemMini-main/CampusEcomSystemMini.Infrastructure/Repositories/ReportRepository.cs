using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly AppDbContext _context;

    public ReportRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Report?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Reports
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task<List<Report>> GetByReporterIdAsync(
        Guid reporterId,
        CancellationToken cancellationToken)
    {
        return await _context.Reports
            .AsNoTracking()
            .Where(x => x.ReporterId == reporterId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Report>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _context.Reports
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Report report,
        CancellationToken cancellationToken)
    {
        await _context.Reports.AddAsync(
            report,
            cancellationToken);
    }

    public void UpdateAsync(
        Report report,
        CancellationToken cancellationToken)
    {
        _context.Reports.Update(report);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}