using CampusEcomSystemMini.Application.Library.Documents;

namespace CampusEcomSystemMini.Application.Interfaces;

// Kiểm tra file tải lên trước khi lưu.
// MODULE_4 yêu cầu Backend tự kiểm tra chứ không tin
// hoàn toàn vào extension do client gửi lên.
public interface IDocumentFileValidator
{
    // Kiểm tra extension, kích thước, file rỗng và nội dung thật của file.
    // Trả về kết quả kèm FileType đã chuẩn hóa (pdf / docx).
    Task<DocumentFileValidationResult> ValidateAsync(
        DocumentUpload upload,
        CancellationToken cancellationToken);
}