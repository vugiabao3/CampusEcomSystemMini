using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class PostLikeRepository : IPostLikeRepository
{
    private readonly AppDbContext _context;

    public PostLikeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PostLike?> GetByPostAndUserAsync(
        Guid postId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.PostLikes
            .FirstOrDefaultAsync(
                x => x.PostId == postId && x.UserId == userId,
                cancellationToken);
    }

    public async Task<List<PostLike>> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken)
    {
        return await _context.PostLikes
            .AsNoTracking()
            .Where(x => x.PostId == postId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        PostLike postLike,
        CancellationToken cancellationToken)
    {
        await _context.PostLikes.AddAsync(
            postLike,
            cancellationToken);
    }

    public void Remove(
        PostLike postLike)
    {
        _context.PostLikes.Remove(postLike);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}