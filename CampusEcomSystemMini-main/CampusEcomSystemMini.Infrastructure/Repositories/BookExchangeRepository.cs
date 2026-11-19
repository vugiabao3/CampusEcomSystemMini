using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class BookExchangeRepository : IBookExchangeRepository
{
    private readonly AppDbContext _context;

    public BookExchangeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookExchangePost>> GetAllAsync(
        string? search,
        string? status,
        CancellationToken cancellationToken)
    {
        // Bộ lọc được áp dụng ngay trong truy vấn database.
        var query = _context.BookExchangePosts.AsNoTracking();

        // search khớp vào sách đang có hoặc sách đang tìm.
        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim();

            query = query.Where(
                x => x.BookName.Contains(normalizedSearch) ||
                      x.WantedBookName.Contains(normalizedSearch));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalizedStatus = status.Trim();

            query = query.Where(
                x => x.Status == normalizedStatus);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<BookExchangePost>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.BookExchangePosts
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<BookExchangePost?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.BookExchangePosts
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task AddAsync(
        BookExchangePost post,
        CancellationToken cancellationToken)
    {
        await _context.BookExchangePosts.AddAsync(
            post,
            cancellationToken);
    }

    public void UpdateAsync(
        BookExchangePost post,
        CancellationToken cancellationToken)
    {
        _context.BookExchangePosts.Update(post);
    }

    public void Remove(
        BookExchangePost post)
    {
        _context.BookExchangePosts.Remove(post);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
