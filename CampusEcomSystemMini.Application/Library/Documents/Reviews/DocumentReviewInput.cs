namespace CampusEcomSystemMini.Application.Library.Documents.Reviews;

// Chuẩn hóa dữ liệu đầu vào của review.
internal static class DocumentReviewInput
{
    public const int MinRating = 1;

    public const int MaxRating = 5;

    // Rating phải nằm trong khoảng 1–5.
    // Trả về null nếu client không gửi hoặc gửi sai.
    public static int? NormalizeRating(int? rating)
    {
        if (rating is null)
        {
            return null;
        }

        if (rating < MinRating || rating > MaxRating)
        {
            return null;
        }

        return rating.Value;
    }

    public static string? NormalizeComment(string? comment)
    {
        if (string.IsNullOrWhiteSpace(comment))
        {
            return null;
        }

        return comment.Trim();
    }
}