using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken)
    {
        return await _context.Users
            .FirstOrDefaultAsync(
                x => x.Email == email,
                cancellationToken);
    }

     public async Task<User?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Users
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task<List<User>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _context.Users
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        User user,
        CancellationToken cancellationToken)
    {
        await _context.Users.AddAsync(
            user,
            cancellationToken);
    }

    public void UpdateAsync(
        User user,
        CancellationToken cancellationToken)
    {
        _context.Users.Update(user);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(
            cancellationToken);
    }
}

