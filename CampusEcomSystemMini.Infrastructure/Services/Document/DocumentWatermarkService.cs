using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Library.Documents;
using CampusEcomSystemMini.Infrastructure.Services.Document.Watermark;
using CampusEcomSystemMini.Infrastructure.Services.Document.Watermark.Pdf;

namespace CampusEcomSystemMini.Infrastructure.Services.Document;

// Watermark của MODULE 4 / BATCH 3.
//
// Chỉ PDF và DOCX được phép đăng tải theo batch Upload,
// nên engine đóng dấu chỉ hỗ trợ hai định dạng này.
// Không thêm package PDF/DOCX mới: PDF xử lý bằng C# thuần,
// DOCX xử lý bằng System.IO.Compression có sẵn trong .NET.
//
// Watermark thất bại phải trả lỗi để Download dừng lại,
// không được trả file gốc cho người tải.
public class DocumentWatermarkService : IDocumentWatermarkService
{
    public Task<DocumentWatermarkResult> ApplyAsync(
        DocumentWatermarkRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Content is null || request.Content.Length == 0)
        {
            return Task.FromResult(
                DocumentWatermarkResult.Failed(
                    "File tài liệu rỗng, không thể đóng dấu watermark."));
        }

        var lines = WatermarkTextFactory.Create(
            request.FullName,
            request.Email,
            request.DownloadedAt);

        byte[] watermarked;

        string? error;

        if (IsDocx(request.FileType))
        {
            if (!DocxWatermarkWriter.TryApply(
                request.Content,
                lines,
                out watermarked,
                out error))
            {
                return Task.FromResult(
                    DocumentWatermarkResult.Failed(
                        error ??
                        "Không thể đóng dấu watermark cho file DOCX."));
            }
        }
        else if (!PdfWatermarkWriter.TryApply(
            request.Content,
            lines,
            out watermarked,
            out error))
        {
            return Task.FromResult(
                DocumentWatermarkResult.Failed(
                    error ??
                    "Không thể đóng dấu watermark cho file PDF."));
        }

        return Task.FromResult(
            DocumentWatermarkResult.Watermarked(watermarked));
    }

    private static bool IsDocx(string? fileType)
    {
        return string.Equals(
            fileType,
            "docx",
            StringComparison.OrdinalIgnoreCase);
    }
}
