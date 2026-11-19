using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IDocumentReviewRepository
{
    // Danh sách review của một tài liệu, mới nhất trước.
    Task<List<DocumentReview>> GetByDocumentIdAsync(
        Guid documentId,
        CancellationToken cancellationToken);

    Task<DocumentReview?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    // Kiểm tra người dùng đã đánh giá tài liệu này chưa.
    // Mỗi người chỉ được đánh giá một tài liệu đúng một lần.
    Task<DocumentReview?> GetByUserAndDocumentAsync(
        Guid userId,
        Guid documentId,
        CancellationToken cancellationToken);

    Task AddAsync(
        DocumentReview review,
        CancellationToken cancellationToken);

    void UpdateAsync(
        DocumentReview review,
        CancellationToken cancellationToken);

    void Remove(DocumentReview review);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}