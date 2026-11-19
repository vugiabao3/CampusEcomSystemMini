using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface IDocumentRepository
{
    // search khớp vào Title hoặc Description,
    // subject lọc theo môn học / khoa,
    // pricing lọc theo Free hoặc Paid.
    // Cả ba đều không bắt buộc.
    Task<List<Document>> GetAllAsync(
        string? search,
        string? subject,
        string? pricing,
        CancellationToken cancellationToken);

    Task<List<Document>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken);

    Task<Document?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);

    Task AddAsync(
        Document document,
        CancellationToken cancellationToken);

    void UpdateAsync(
        Document document,
        CancellationToken cancellationToken);

    void Remove(
        Document document);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}