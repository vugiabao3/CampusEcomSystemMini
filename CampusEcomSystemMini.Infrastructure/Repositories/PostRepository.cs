using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class PostRepository : IPostRepository
{
    private readonly AppDbContext _context;

    public PostRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Post>> GetAllAsync(
        string? type,
        DateTime? createdFromUtc,
        DateTime? createdToUtc,
        CancellationToken cancellationToken)
    {
        // Bộ lọc được áp dụng ngay trong truy vấn database.
        var query = _context.Posts.AsNoTracking();

        if (!string.IsNullOrEmpty(type))
        {
            var normalizedType = type.ToLower();

            query = query.Where(
                x => x.Type != null &&
                      x.Type.ToLower() == normalizedType);
        }

        if (createdFromUtc.HasValue)
        {
            query = query.Where(
                x => x.CreatedAt >= createdFromUtc.Value);
        }

        if (createdToUtc.HasValue)
        {
            query = query.Where(
                x => x.CreatedAt < createdToUtc.Value);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Post>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.Posts
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Post?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Posts
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task AddAsync(
        Post post,
        CancellationToken cancellationToken)
    {
        await _context.Posts.AddAsync(
            post,
            cancellationToken);
    }

    public void UpdateAsync(
        Post post,
        CancellationToken cancellationToken)
    {
        _context.Posts.Update(post);
    }

    public void Remove(
        Post post)
    {
        _context.Posts.Remove(post);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}