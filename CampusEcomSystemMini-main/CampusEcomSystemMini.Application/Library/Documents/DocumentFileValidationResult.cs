namespace CampusEcomSystemMini.Application.Library.Documents;

// Kết quả kiểm tra file tải lên.
// Handler ánh xạ IsValid = false thành HTTP 400.
public record DocumentFileValidationResult(
    bool IsValid,
    string? FileType,
    string? ErrorMessage)
{
    public static DocumentFileValidationResult Invalid(
        string errorMessage)
    {
        return new DocumentFileValidationResult(
            false,
            null,
            errorMessage);
    }

    public static DocumentFileValidationResult Valid(
        string fileType)
    {
        return new DocumentFileValidationResult(
            true,
            fileType,
            null);
    }
}