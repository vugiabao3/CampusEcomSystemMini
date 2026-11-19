using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Library.Documents.Reviews;

// Tính lại Rating / ReviewCount của tài liệu sau khi
// thêm, sửa hoặc xóa review.
//
// Phải gọi sau khi đã lưu thay đổi review xuống database,
// vì điểm trung bình được tính từ danh sách review trong database.
// Rating là điểm trung bình của các review còn lại,
// ReviewCount là số review còn lại.
// Tài liệu chưa có review thì cả hai về 0.
//
// Hàm chỉ đánh dấu tài liệu thay đổi,
// handler gọi SaveChangesAsync để lưu.
internal static class DocumentReviewAggregator
{
    public static async Task ApplyAsync(
        Document document,
        IDocumentRepository documentRepository,
        IDocumentReviewRepository reviewRepository,
        CancellationToken cancellationToken)
    {
        var reviews = await reviewRepository.GetByDocumentIdAsync(
            document.Id,
            cancellationToken);

        document.ReviewCount = reviews.Count;

        document.Rating = reviews.Count == 0
            ? 0m
            : Math.Round(
                reviews.Average(review => (decimal)review.Rating),
                2,
                MidpointRounding.AwayFromZero);

        documentRepository.UpdateAsync(
            document,
            cancellationToken);
    }
}