namespace CampusEcomSystemMini.Infrastructure.Services.Document.Watermark.Pdf;

// Mô hình object tối giản của PDF.
//
// Watermark của MODULE 4 không thêm package PDF engine,
// nên phần đóng dấu được xử lý bằng C# thuần
// (System.IO.Compression có sẵn trong .NET để giải nén Flate).
//
// Mỗi object giữ thêm Raw = nguyên văn của object trong file gốc.
// Khi ghi lại file, object không bị sửa được in lại nguyên văn
// nên không làm hỏng nội dung phức tạp của file PDF gốc.
internal abstract class PdfObject
{
    public string Raw { get; set; } = string.Empty;
}

internal sealed class PdfNull : PdfObject
{
    public static readonly PdfNull Instance = new();
}

internal sealed class PdfBoolean : PdfObject
{
    public bool Value { get; set; }
}

internal sealed class PdfNumber : PdfObject
{
    public double Value { get; set; }
}

internal sealed class PdfName : PdfObject
{
    public string Value { get; set; } = string.Empty;
}

internal sealed class PdfString : PdfObject
{
    public string Value { get; set; } = string.Empty;
}

// Tham chiếu tới object khác, ví dụ 12 0 R.
internal sealed class PdfReference : PdfObject
{
    public int Number { get; set; }

    public int Generation { get; set; }
}

internal sealed class PdfArray : PdfObject
{
    public List<PdfObject> Items { get; } = new();
}

internal sealed class PdfDictionary : PdfObject
{
    // Dictionary trong PDF không có thứ tự yêu cầu nhưng giữ thứ tự gốc
    // giúp file sau khi đóng dấu vẫn dễ đọc.
    private readonly List<KeyValuePair<string, PdfObject>> _entries = new();

    public IReadOnlyList<KeyValuePair<string, PdfObject>> Entries => _entries;

    public bool TryGet(string key, out PdfObject? value)
    {
        foreach (var entry in _entries)
        {
            if (string.Equals(
                entry.Key,
                key,
                StringComparison.Ordinal))
            {
                value = entry.Value;

                return true;
            }
        }

        value = null;

        return false;
    }

    public PdfObject? Get(string key)
    {
        return TryGet(key, out var value) ? value : null;
    }

    public void Set(string key, PdfObject value)
    {
        for (var index = 0; index < _entries.Count; index++)
        {
            if (string.Equals(
                _entries[index].Key,
                key,
                StringComparison.Ordinal))
            {
                _entries[index] = new KeyValuePair<string, PdfObject>(
                    key,
                    value);

                return;
            }
        }

        _entries.Add(new KeyValuePair<string, PdfObject>(key, value));
    }

    public void Remove(string key)
    {
        _entries.RemoveAll(
            entry => string.Equals(
                entry.Key,
                key,
                StringComparison.Ordinal));
    }

    public string? GetName(string key)
    {
        return Get(key) is PdfName name ? name.Value : null;
    }
}

// Stream = dictionary + dữ liệu nhị phân.
// Giữ nguyên dữ liệu gốc, khi ghi lại luôn dùng /Length trực tiếp
// để không phụ thuộc /Length gián tiếp.
internal sealed class PdfStream : PdfObject
{
    public PdfDictionary Dictionary { get; set; } = new();

    public byte[] Data { get; set; } = Array.Empty<byte>();
}
