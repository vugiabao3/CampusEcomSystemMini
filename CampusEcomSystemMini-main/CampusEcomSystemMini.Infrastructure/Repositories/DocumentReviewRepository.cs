using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class DocumentReviewRepository : IDocumentReviewRepository
{
    private readonly AppDbContext _context;

    public DocumentReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<DocumentReview>> GetByDocumentIdAsync(
        Guid documentId,
        CancellationToken cancellationToken)
    {
        return await _context.DocumentReviews
            .AsNoTracking()
            .Where(x => x.DocumentId == documentId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<DocumentReview?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.DocumentReviews
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }

    public async Task<DocumentReview?> GetByUserAndDocumentAsync(
        Guid userId,
        Guid documentId,
        CancellationToken cancellationToken)
    {
        return await _context.DocumentReviews
            .FirstOrDefaultAsync(
                x => x.UserId == userId &&
                     x.DocumentId == documentId,
                cancellationToken);
    }

    public async Task AddAsync(
        DocumentReview review,
        CancellationToken cancellationToken)
    {
        await _context.DocumentReviews.AddAsync(
            review,
            cancellationToken);
    }

    public void UpdateAsync(
        DocumentReview review,
        CancellationToken cancellationToken)
    {
        _context.DocumentReviews.Update(review);
    }

    public void Remove(DocumentReview review)
    {
        _context.DocumentReviews.Remove(review);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}