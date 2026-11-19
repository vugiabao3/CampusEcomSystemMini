namespace CampusEcomSystemMini.Application.Library.Documents;

// Kết quả đóng dấu watermark.
//
// Watermark thất bại phải làm handler Download dừng lại
// và trả lỗi, không được trả file gốc cho người dùng.
public sealed record DocumentWatermarkResult(
    bool Success,
    byte[]? Content,
    string? ErrorMessage)
{
    public static DocumentWatermarkResult Watermarked(
        byte[] content)
    {
        return new DocumentWatermarkResult(
            true,
            content,
            null);
    }

    public static DocumentWatermarkResult Failed(
        string errorMessage)
    {
        return new DocumentWatermarkResult(
            false,
            null,
            errorMessage);
    }
}
