using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class PreferenceRepository : IPreferenceRepository
{
    private readonly AppDbContext _context;

    public PreferenceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Preference?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.Preferences
            .FirstOrDefaultAsync(
                x => x.UserId == userId,
                cancellationToken);
    }

    public async Task<List<Preference>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _context.Preferences
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Preference preference,
        CancellationToken cancellationToken)
    {
        await _context.Preferences.AddAsync(
            preference,
            cancellationToken);
    }

    public void UpdateAsync(
        Preference preference,
        CancellationToken cancellationToken)
    {
        _context.Preferences.Update(preference);
    }

    public void Remove(
        Preference preference)
    {
        _context.Preferences.Remove(preference);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}