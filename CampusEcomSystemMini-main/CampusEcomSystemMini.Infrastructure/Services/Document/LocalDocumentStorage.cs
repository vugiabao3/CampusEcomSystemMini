using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Library.Documents;
using Microsoft.Extensions.Configuration;

namespace CampusEcomSystemMini.Infrastructure.Services.Document;

// Lưu trữ file tài liệu trên local disk, nằm ngoài database.
// MODULE_4 cho phép local storage ở giai đoạn prototype.
// Đường dẫn lưu trữ cấu hình qua
// DocumentStorage:RootPath trong appsettings.json.
public class LocalDocumentStorage : IDocumentStorage
{
    private const string DefaultRootPath = "App_Data/documents";

    private readonly string _rootPath;

    public LocalDocumentStorage(IConfiguration configuration)
    {
        var configuredPath = configuration[
            "DocumentStorage:RootPath"];

        if (string.IsNullOrWhiteSpace(configuredPath))
        {
            configuredPath = DefaultRootPath;
        }

        _rootPath = Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(
                Directory.GetCurrentDirectory(),
                configuredPath);
    }

    public async Task<string> SaveAsync(
        DocumentUpload upload,
        CancellationToken cancellationToken)
    {
        Directory.CreateDirectory(_rootPath);

        // Tên file lưu trữ là GUID nên không thể đoán
        // từ tên file người dùng gửi lên.
        var storedFileName = Guid.NewGuid().ToString("N");

        var filePath = Path.Combine(
            _rootPath,
            storedFileName);

        await using var target = File.Create(filePath);

        await upload.Content.CopyToAsync(
            target,
            cancellationToken);

        return storedFileName;
    }

    public void Delete(string storedFileName)
    {
        // StoredFileName do Backend sinh ra,
        // vẫn chặn đường dẫn để không xóa nhầm file ngoài thư mục lưu trữ.
        var filePath = ResolveFilePath(storedFileName);

        if (filePath is null)
        {
            return;
        }

        // File không tồn tại vẫn coi như đã xóa.
        if (!File.Exists(filePath))
        {
            return;
        }

        File.Delete(filePath);
    }

    public async Task<byte[]?> GetContentAsync(
        string storedFileName,
        CancellationToken cancellationToken)
    {
        var filePath = ResolveFilePath(storedFileName);

        if (filePath is null)
        {
            return null;
        }

        if (!File.Exists(filePath))
        {
            return null;
        }

        return await File.ReadAllBytesAsync(
            filePath,
            cancellationToken);
    }

    // Trả về null nếu StoredFileName không hợp lệ,
    // tránh đọc hoặc xóa nhầm file ngoài thư mục lưu trữ.
    private string? ResolveFilePath(string storedFileName)
    {
        if (string.IsNullOrWhiteSpace(storedFileName) ||
            storedFileName.Contains(Path.DirectorySeparatorChar) ||
            storedFileName.Contains(Path.AltDirectorySeparatorChar) ||
            storedFileName.Contains(".."))
        {
            return null;
        }

        return Path.Combine(_rootPath, storedFileName);
    }
}