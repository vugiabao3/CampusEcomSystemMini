using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class ClaimRepository : IClaimRepository
{
    private readonly AppDbContext _context;

    public ClaimRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Claim?> GetByIdAsync(
        Guid claimId,
        CancellationToken cancellationToken)
    {
        return await _context.Claims
            .FirstOrDefaultAsync(
                x => x.Id == claimId,
                cancellationToken);
    }

    public async Task<List<Claim>> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken)
    {
        // Yêu cầu cũ nhất lên đầu để người nhặt đồ
        // xử lý theo thứ tự gửi.
        return await _context.Claims
            .AsNoTracking()
            .Where(x => x.PostId == postId)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Claim claim,
        CancellationToken cancellationToken)
    {
        await _context.Claims.AddAsync(claim, cancellationToken);
    }

    public void UpdateAsync(
        Claim claim,
        CancellationToken cancellationToken)
    {
        _context.Claims.Update(claim);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}