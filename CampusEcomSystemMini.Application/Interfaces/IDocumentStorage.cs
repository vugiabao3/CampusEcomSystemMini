using CampusEcomSystemMini.Application.Library.Documents;

namespace CampusEcomSystemMini.Application.Interfaces;

// Lưu trữ file tài liệu ngoài database.
// MODULE_4 cho phép local storage ở giai đoạn prototype,
// nếu sau này chuyển sang cloud storage chỉ thay lớp Infrastructure.
public interface IDocumentStorage
{
    // Lưu file và trả về StoredFileName để lưu vào database.
    Task<string> SaveAsync(
        DocumentUpload upload,
        CancellationToken cancellationToken);

    // Xoá file theo StoredFileName.
    // File không tồn tại vẫn coi như đã xoá.
    void Delete(string storedFileName);
}