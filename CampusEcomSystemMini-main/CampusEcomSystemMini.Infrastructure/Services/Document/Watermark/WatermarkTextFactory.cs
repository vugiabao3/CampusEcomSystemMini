using System.Globalization;
using System.Text;

namespace CampusEcomSystemMini.Infrastructure.Services.Document.Watermark;

// Một dòng chữ watermark.
internal sealed record WatermarkTextLine(string Text, double FontSize);

// Dựng nội dung watermark của MODULE 4.
//
// Workflow tải tài liệu đóng dấu người tải:
//   FullName + Email
//   Timestamp
internal static class WatermarkTextFactory
{
    public static IReadOnlyList<WatermarkTextLine> Create(
        string? fullName,
        string? email,
        DateTimeOffset downloadedAt)
    {
        var lines = new List<WatermarkTextLine>();

        var identity = BuildIdentity(fullName, email);

        if (!string.IsNullOrWhiteSpace(identity))
        {
            lines.Add(new WatermarkTextLine(identity, 26d));
        }

        lines.Add(
            new WatermarkTextLine(
                FormatTimestamp(downloadedAt),
                12d));

        return lines;
    }

    private static string BuildIdentity(string? fullName, string? email)
    {
        var name = (fullName ?? string.Empty).Trim();

        var mail = (email ?? string.Empty).Trim();

        if (name.Length == 0)
        {
            return mail;
        }

        if (mail.Length == 0)
        {
            return name;
        }

        return $"{name} ({mail})";
    }

    private static string FormatTimestamp(DateTimeOffset downloadedAt)
    {
        return downloadedAt.UtcDateTime.ToString(
            "yyyy-MM-dd HH:mm 'UTC'",
            CultureInfo.InvariantCulture);
    }

    // Font chuẩn Helvetica dùng WinAnsiEncoding nên chỉ hiển thị được
    // ký tự Latin-1. Không nhúng font mới vì batch này không thêm package,
    // nên dấu tiếng Việt được bỏ dấu trước khi vẽ lên PDF.
    // Đồng thời escape để dùng được trong PDF literal string.
    public static string ToPdfStringContent(string? text)
    {
        var folded = FoldToLatin(text);

        if (folded.Length == 0)
        {
            return string.Empty;
        }

        var builder = new StringBuilder();

        foreach (var character in folded)
        {
            switch (character)
            {
                case '(':
                case ')':
                case '\\':
                    builder.Append('\\');
                    builder.Append(character);
                    break;

                default:
                    builder.Append(character);
                    break;
            }
        }

        return builder.ToString();
    }

    private static string FoldToLatin(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return string.Empty;
        }

        var normalized = text.Normalize(NormalizationForm.FormD);

        var builder = new StringBuilder();

        foreach (var character in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(character) ==
                UnicodeCategory.NonSpacingMark)
            {
                // Bỏ dấu.
                continue;
            }

            var value = character switch
            {
                'đ' or 'Đ' => 'D',
                _ => character
            };

            if (value is >= ' ' and <= '~')
            {
                builder.Append(value);
            }
            else if (value is >= '\u00A0' and <= 'ÿ')
            {
                builder.Append(value);
            }
            else
            {
                builder.Append('?');
            }
        }

        return builder.ToString().Trim();
    }
}
