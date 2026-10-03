using CampusEcomSystemMini.Application.Library.Documents;

namespace CampusEcomSystemMini.Application.Interfaces;

// Đóng dấu watermark lên file tài liệu trước khi trả về người tải.
//
// Workflow MODULE 4:
//   Original PDF -> Watermark Engine -> Watermarked PDF -> Download.
//
// Nếu watermark thất bại thì phải trả lỗi,
// không được trả file gốc và không được hoàn tất giao dịch điểm.
public interface IDocumentWatermarkService
{
    Task<DocumentWatermarkResult> ApplyAsync(
        DocumentWatermarkRequest request,
        CancellationToken cancellationToken);
}
