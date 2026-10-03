using System.IO.Compression;

using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Library.Documents;

namespace CampusEcomSystemMini.Infrastructure.Services.Document;

// Kiểm tra file tải lên mà không thêm package nào.
//
// MODULE_4 yêu cầu Backend không tin hoàn toàn vào extension
// do client gửi lên, nên ngoài extension còn kiểm tra:
//   - file rỗng;
//   - kích thước vượt quá 25MB;
//   - chữ ký nội dung đúng định dạng;
//   - DOCX phải là file ZIP hợp lệ có cấu trúc Office Open XML.
public class DocumentFileValidator : IDocumentFileValidator
{
    // Giới hạn 25MB theo workflow Upload tài liệu.
    public const long MaxFileSizeBytes = 25L * 1024L * 1024L;

    private const string PdfFileType = "pdf";

    private const string DocxFileType = "docx";

    // Chữ ký đầu file PDF.
    private static readonly byte[] PdfSignature =
        [0x25, 0x50, 0x44, 0x46, 0x2D];

    // Chữ ký đầu file ZIP, dùng cho DOCX.
    private static readonly byte[] ZipSignature =
        [0x50, 0x4B, 0x03, 0x04];

    // Thành phần bắt buộc của một file DOCX hợp lệ.
    private const string DocxContentTypesEntry = "[Content_Types].xml";

    private const string DocxMainDocumentEntry = "word/document.xml";

    public async Task<DocumentFileValidationResult> ValidateAsync(
        DocumentUpload upload,
        CancellationToken cancellationToken)
    {
        if (upload is null || upload.Content is null)
        {
            return DocumentFileValidationResult.Invalid(
                "A PDF or DOCX file is required.");
        }

        // File rỗng hoặc không đọc được.
        if (upload.Length <= 0)
        {
            return DocumentFileValidationResult.Invalid(
                "The uploaded file is empty.");
        }

        if (upload.Length > MaxFileSizeBytes)
        {
            return DocumentFileValidationResult.Invalid(
                "The uploaded file exceeds the 25MB limit.");
        }

        var fileType = ResolveFileType(upload.FileName);

        if (fileType is null)
        {
            return DocumentFileValidationResult.Invalid(
                "Only PDF and DOCX files are allowed.");
        }

        if (!await HasValidSignatureAsync(
                upload,
                fileType,
                cancellationToken))
        {
            return DocumentFileValidationResult.Invalid(
                $"The uploaded file is not a valid {fileType.ToUpperInvariant()} file.");
        }

        return DocumentFileValidationResult.Valid(fileType);
    }

    // Chuyẩn hóa đuôi file về pdf hoặc docx.
    // Trả về null nếu đuôi file không được phép.
    private static string? ResolveFileType(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        var extension = Path.GetExtension(fileName.Trim());

        if (string.IsNullOrWhiteSpace(extension))
        {
            return null;
        }

        return extension.ToLowerInvariant() switch
        {
            "." + PdfFileType => PdfFileType,

            "." + DocxFileType => DocxFileType,

            _ => null
        };
    }

    private static async Task<bool> HasValidSignatureAsync(
        DocumentUpload upload,
        string fileType,
        CancellationToken cancellationToken)
    {
        var content = upload.Content;

        if (!content.CanSeek)
        {
            return false;
        }

        content.Position = 0;

        var isValid = fileType == PdfFileType
            ? await HasPdfSignatureAsync(content, cancellationToken)
            : await HasDocxStructureAsync(content, cancellationToken);

        content.Position = 0;

        return isValid;
    }

    // File PDF thật bắt đầu bằng chữ ký %PDF-.
    private static async Task<bool> HasPdfSignatureAsync(
        Stream content,
        CancellationToken cancellationToken)
    {
        var header = new byte[PdfSignature.Length];

        var read = await ReadExactlyAsync(
            content,
            header,
            cancellationToken);

        if (read < header.Length)
        {
            return false;
        }

        return header.SequenceEqual(PdfSignature);
    }

    // DOCX là gói ZIP của Office Open XML,
    // nên phải là ZIP hợp lệ và có thành phần chính.
    private static async Task<bool> HasDocxStructureAsync(
        Stream content,
        CancellationToken cancellationToken)
    {
        var header = new byte[ZipSignature.Length];

        var read = await ReadExactlyAsync(
            content,
            header,
            cancellationToken);

        if (read < header.Length ||
            !header.SequenceEqual(ZipSignature))
        {
            return false;
        }

        content.Position = 0;

        try
        {
            using var archive = new ZipArchive(
                content,
                ZipArchiveMode.Read,
                leaveOpen: true);

            var entryNames = archive.Entries
                .Select(entry => entry.FullName)
                .ToList();

            return entryNames.Contains(
                       DocxContentTypesEntry,
                       StringComparer.OrdinalIgnoreCase) &&
                   entryNames.Contains(
                       DocxMainDocumentEntry,
                       StringComparer.OrdinalIgnoreCase);
        }
        catch (InvalidDataException)
        {
            // File ZIP hỏng.
            return false;
        }
    }

    private static async Task<int> ReadExactlyAsync(
        Stream content,
        byte[] buffer,
        CancellationToken cancellationToken)
    {
        var totalRead = 0;

        while (totalRead < buffer.Length)
        {
            var read = await content.ReadAsync(
                buffer.AsMemory(totalRead, buffer.Length - totalRead),
                cancellationToken);

            if (read <= 0)
            {
                break;
            }

            totalRead += read;
        }

        return totalRead;
    }
}