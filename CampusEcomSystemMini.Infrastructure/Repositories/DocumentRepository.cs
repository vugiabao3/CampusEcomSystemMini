using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class DocumentRepository : IDocumentRepository
{
    private readonly AppDbContext _context;

    public DocumentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Document>> GetAllAsync(
        string? search,
        string? subject,
        string? pricing,
        CancellationToken cancellationToken)
    {
        // Bộ lọc được áp dụng ngay trong truy vấn database.
        var query = _context.Documents.AsNoTracking();

        // search khớp vào tên tài liệu hoặc mô tả.
        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim();

            query = query.Where(
                x => x.Title.Contains(normalizedSearch) ||
                      (x.Description != null &&
                       x.Description.Contains(normalizedSearch)));
        }

        if (!string.IsNullOrWhiteSpace(subject))
        {
            var normalizedSubject = subject.Trim();

            query = query.Where(
                x => x.Subject.ToLower() == normalizedSubject.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(pricing))
        {
            var normalizedPricing = pricing.Trim();

            query = query.Where(
                x => x.PricingType == normalizedPricing);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Document>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await _context.Documents
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Document?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Documents
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task AddAsync(
        Document document,
        CancellationToken cancellationToken)
    {
        await _context.Documents.AddAsync(
            document,
            cancellationToken);
    }

    public void UpdateAsync(
        Document document,
        CancellationToken cancellationToken)
    {
        _context.Documents.Update(document);
    }

    public void Remove(
        Document document)
    {
        _context.Documents.Remove(document);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}