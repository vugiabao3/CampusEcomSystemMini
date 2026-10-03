using System.Globalization;
using System.Text;

namespace CampusEcomSystemMini.Infrastructure.Services.Document.Watermark.Pdf;

// Đóng dấu watermark lên file PDF bằng C# thuần.
//
// MODULE 4 cho phép dùng iText nếu phù hợp nhưng cũng nói rõ
// không tự thêm package lớn khi chưa cần, nên batch này
// đóng dấu bằng System.IO.Compression (đã có sẵn trong .NET).
//
// Cách làm:
//   1. Đọc toàn bộ object của file PDF.
//   2. Mở rộng object stream (ObjStm) nếu file dùng PDF 1.5+.
//   3. Tìm Catalog -> Pages -> từng Page.
//   4. Thêm một content stream mới vẽ chữ watermark lên mỗi trang,
//      giữ nguyên content stream gốc.
//   5. Ghi lại file, giữ nguyên số thứ tự object
//      nên không phải sửa tham chiếu nào trong file gốc.
internal sealed class PdfWatermarkWriter
{
    private const string FontResourceName = "FWM";

    private const double DefaultPageWidth = 612;

    private const double DefaultPageHeight = 792;

    private const double AverageGlyphRatio = 0.5;

    private readonly string _source;

    private readonly SortedDictionary<int, LoadedObject> _objects = new();

    private PdfDictionary? _trailer;

    private int _nextObjectNumber;

    private PdfWatermarkWriter(string source)
    {
        _source = source;
    }

    private sealed class LoadedObject
    {
        public int Number { get; set; }

        public int Generation { get; set; }

        public PdfObject? Value { get; set; }

        public string Body { get; set; } = string.Empty;
    }

    private sealed class PageInfo
    {
        public PdfDictionary Dictionary { get; set; } = new();

        public PdfDictionary? InheritedResources { get; set; }

        public double Width { get; set; } = DefaultPageWidth;

        public double Height { get; set; } = DefaultPageHeight;
    }

    public static bool TryApply(
        byte[] content,
        IReadOnlyList<WatermarkTextLine> lines,
        out byte[] result,
        out string? error)
    {
        result = Array.Empty<byte>();

        error = null;

        try
        {
            var writer = new PdfWatermarkWriter(
                Encoding.Latin1.GetString(content));

            var applied = writer.Apply(lines);

            if (!applied)
            {
                error = writer.Error;

                return false;
            }

            result = writer.Write();

            return true;
        }
        catch (Exception exception)
        {
            // Watermark thất bại thì phải trả lỗi,
            // không được trả file gốc cho người tải.
            error = $"Không thể đóng dấu watermark cho file PDF: {exception.Message}";

            return false;
        }
    }

    private string? Error { get; set; }

    private bool Apply(IReadOnlyList<WatermarkTextLine> lines)
    {
        if (lines.Count == 0)
        {
            return Fail("Watermark content is empty.");
        }

        if (!_source.Contains("%PDF-", StringComparison.Ordinal))
        {
            return Fail("File PDF không hợp lệ.");
        }

        ScanObjects();

        ExpandObjectStreams();

        if (!LoadTrailer())
        {
            return Fail(Error ?? "Không đọc được trailer của file PDF.");
        }

        // File PDF có mật khẩu thì không thể chèn nội dung an toàn.
        if (Resolve(_trailer!.Get("Encrypt")) is not null)
        {
            return Fail(
                "File PDF được bảo vệ bằng mật khẩu, không thể đóng dấu watermark.");
        }

        var pages = CollectPages();

        if (pages.Count == 0)
        {
            return Fail("Không tìm thấy trang nào trong file PDF.");
        }

        var fontNumber = NewObjectNumber();

        var font = new PdfDictionary
        {
            Raw = string.Empty
        };

        font.Set("Type", new PdfName { Value = "Font" });
        font.Set("Subtype", new PdfName { Value = "Type1" });
        font.Set("BaseFont", new PdfName { Value = "Helvetica" });
        font.Set("Encoding", new PdfName { Value = "WinAnsiEncoding" });

        _objects[fontNumber] = new LoadedObject
        {
            Number = fontNumber,
            Generation = 0,
            Value = font,
            Body = Serialize(font)
        };

        var fontReference = new PdfReference
        {
            Number = fontNumber,
            Generation = 0
        };

        foreach (var page in pages)
        {
            AddWatermarkToPage(page, fontReference, lines);
        }

        return true;
    }

    // =====================================================
    // ĐỌC FILE
    // =====================================================

    private void ScanObjects()
    {
        var parser = new PdfObjectParser(_source);

        var maxNumber = 0;

        while (!parser.AtEnd)
        {
            if (!TryReadObjectHeader(
                ref parser,
                out var number,
                out var generation))
            {
                parser.MoveTo(parser.Position + 1);

                continue;
            }

            var bodyStart = parser.Position;

            var value = parser.ReadObject();

            var bodyEnd = parser.Position;

            // Dictionary của stream được đọc tiếp phần dữ liệu stream.
            if (value is PdfDictionary dictionary &&
                parser.ReadKeyword("stream"))
            {
                var stream = ReadStreamData(
                    ref parser,
                    dictionary,
                    bodyStart);

                value = stream;

                bodyEnd = parser.Position;
            }
            else
            {
                parser.ReadKeyword("endobj");
            }

            var body = _source.Substring(
                bodyStart,
                bodyEnd - bodyStart);

            // Định nghĩa mới hơn đè lên định nghĩa cũ.
            _objects[number] = new LoadedObject
            {
                Number = number,
                Generation = generation,
                Value = value,
                Body = body
            };

            if (number > maxNumber)
            {
                maxNumber = number;
            }
        }

        _nextObjectNumber = maxNumber + 1;
    }

    private bool TryReadObjectHeader(
        ref PdfObjectParser parser,
        out int number,
        out int generation)
    {
        number = 0;

        generation = 0;

        var start = parser.Position;

        if (!TryReadInteger(ref parser, out number))
        {
            parser.MoveTo(start);

            return false;
        }

        if (!TryReadInteger(ref parser, out generation))
        {
            parser.MoveTo(start);

            return false;
        }

        if (!parser.ReadKeyword("obj"))
        {
            parser.MoveTo(start);

            return false;
        }

        return true;
    }

    private bool TryReadInteger(
        ref PdfObjectParser parser,
        out int value)
    {
        value = 0;

        parser.SkipWhitespace();

        var start = parser.Position;

        var negative = false;

        if (parser.Position < _source.Length &&
            _source[parser.Position] is '+' or '-')
        {
            negative = _source[parser.Position] == '-';

            parser.MoveTo(parser.Position + 1);
        }

        while (parser.Position < _source.Length &&
               char.IsDigit(_source[parser.Position]))
        {
            parser.MoveTo(parser.Position + 1);
        }

        if (parser.Position == start ||
            !int.TryParse(
                _source.Substring(start, parser.Position - start),
                NumberStyles.Integer,
                CultureInfo.InvariantCulture,
                out value))
        {
            parser.MoveTo(start);

            return false;
        }

        if (negative)
        {
            value = -value;
        }

        return true;
    }

    private PdfStream? ReadStreamData(
        ref PdfObjectParser parser,
        PdfDictionary dictionary,
        int bodyStart)
    {
        // Sau keyword stream phải có ký tự xuống dòng.
        if (parser.Position < _source.Length &&
            _source[parser.Position] == '\r')
        {
            parser.MoveTo(parser.Position + 1);
        }

        if (parser.Position < _source.Length &&
            _source[parser.Position] == '\n')
        {
            parser.MoveTo(parser.Position + 1);
        }

        var dataStart = parser.Position;

        var dataEnd = _source.Length;

        // /Length thường là số trực tiếp.
        // Trường hợp /Length là tham chiếu gián tiếp thì tìm endstream.
        if (Resolve(dictionary.Get("Length")) is PdfNumber length &&
            length.Value >= 0 &&
            dataStart + (int)length.Value <= _source.Length)
        {
            dataEnd = dataStart + (int)length.Value;
        }
        else
        {
            var index = _source.IndexOf(
                "endstream",
                dataStart,
                StringComparison.Ordinal);

            if (index >= 0)
            {
                dataEnd = index;

                // Loại ký tự xuống dòng trước endstream.
                if (dataEnd > dataStart &&
                    _source[dataEnd - 1] == '\n')
                {
                    dataEnd--;
                }

                if (dataEnd > dataStart &&
                    _source[dataEnd - 1] == '\r')
                {
                    dataEnd--;
                }
            }
        }

        var data = Encoding.Latin1.GetBytes(
            _source.Substring(dataStart, dataEnd - dataStart));

        var streamEnd = _source.IndexOf(
            "endstream",
            dataEnd,
            StringComparison.Ordinal);

        parser.MoveTo(
            streamEnd >= 0
                ? streamEnd + "endstream".Length
                : dataEnd);

        parser.ReadKeyword("endobj");

        return new PdfStream
        {
            Dictionary = dictionary,
            Data = data,
            Raw = _source.Substring(
                bodyStart,
                parser.Position - bodyStart)
        };
    }

    // Mở rộng object stream (PDF 1.5+) để lấy được object nằm trong stream.
    private void ExpandObjectStreams()
    {
        foreach (var loaded in _objects.Values.ToList())
        {
            if (loaded.Value is not PdfStream stream)
            {
                continue;
            }

            if (!string.Equals(
                stream.Dictionary.GetName("Type"),
                "ObjStm",
                StringComparison.Ordinal))
            {
                continue;
            }

            var decoded = DecodeFlate(stream);

            if (decoded is null)
            {
                continue;
            }

            if (Resolve(stream.Dictionary.Get("N")) is not PdfNumber count ||
                Resolve(stream.Dictionary.Get("First")) is not PdfNumber first)
            {
                continue;
            }

            var text = Encoding.Latin1.GetString(decoded);

            var pairs = new List<(int Number, int Offset)>();

            var parser = new PdfObjectParser(text);

            for (var index = 0; index < (int)count.Value; index++)
            {
                if (parser.ReadObject() is not PdfNumber objectNumber ||
                    parser.ReadObject() is not PdfNumber offset)
                {
                    break;
                }

                pairs.Add(((int)objectNumber.Value, (int)offset.Value));
            }

            foreach (var pair in pairs)
            {
                if (_objects.ContainsKey(pair.Number))
                {
                    continue;
                }

                var objectParser = new PdfObjectParser(
                    text,
                    (int)first.Value + pair.Offset);

                var value = objectParser.ReadObject();

                if (value is null)
                {
                    continue;
                }

                _objects[pair.Number] = new LoadedObject
                {
                    Number = pair.Number,
                    Generation = 0,
                    Value = value,
                    Body = text.Substring(
                        (int)first.Value + pair.Offset,
                        objectParser.Position - ((int)first.Value + pair.Offset))
                };
            }
        }
    }

    private static byte[]? DecodeFlate(PdfStream stream)
    {
        var filters = new List<string>();

        switch (stream.Dictionary.Get("Filter"))
        {
            case PdfName name:
                filters.Add(name.Value);
                break;

            case PdfArray array:
                foreach (var item in array.Items)
                {
                    if (item is PdfName itemName)
                    {
                        filters.Add(itemName.Value);
                    }
                }

                break;
        }

        if (filters.Count == 0)
        {
            return stream.Data;
        }

        var data = stream.Data;

        foreach (var filter in filters)
        {
            if (!string.Equals(
                filter,
                "FlateDecode",
                StringComparison.Ordinal))
            {
                return null;
            }

            data = Inflate(data);

            if (data is null)
            {
                return null;
            }
        }

        return data;
    }

    private static byte[]? Inflate(byte[] data)
    {
        // Flate của PDF dùng zlib, nhưng có tệp bỏ header zlib
        // nên thử thêm DeflateStream.
        try
        {
            return Decompress(
                data,
                static (input, output) =>
                {
                    using var zlib = new System.IO.Compression.ZLibStream(
                        input,
                        System.IO.Compression.CompressionMode.Decompress,
                        true);

                    zlib.CopyTo(output);
                });
        }
        catch
        {
            // Thử kiểu Deflate thô.
        }

        try
        {
            return Decompress(
                data,
                static (input, output) =>
                {
                    using var deflate = new System.IO.Compression.DeflateStream(
                        input,
                        System.IO.Compression.CompressionMode.Decompress,
                        true);

                    deflate.CopyTo(output);
                });
        }
        catch
        {
            return null;
        }
    }

    private static byte[] Decompress(
        byte[] data,
        Action<MemoryStream, MemoryStream> decompress)
    {
        using var input = new MemoryStream(data);
        using var output = new MemoryStream();

        decompress(input, output);

        return output.ToArray();
    }

    private bool LoadTrailer()
    {
        var index = _source.LastIndexOf(
            "trailer",
            StringComparison.Ordinal);

        if (index >= 0)
        {
            var parser = new PdfObjectParser(_source, index + "trailer".Length);

            if (parser.ReadObject() is PdfDictionary dictionary &&
                dictionary.Get("Root") is not null)
            {
                _trailer = dictionary;

                return true;
            }
        }

        // File dùng xref stream thì trailer nằm trong dictionary của stream.
        foreach (var loaded in _objects.Values.Reverse())
        {
            if (loaded.Value is not PdfStream stream)
            {
                continue;
            }

            if (!string.Equals(
                stream.Dictionary.GetName("Type"),
                "XRef",
                StringComparison.Ordinal))
            {
                continue;
            }

            if (stream.Dictionary.Get("Root") is null)
            {
                continue;
            }

            _trailer = stream.Dictionary;

            return true;
        }

        return Fail("Không tìm thấy trailer của file PDF.");
    }

    // =====================================================
    // DUYỆT CÂY TRANG
    // =====================================================

    private List<PageInfo> CollectPages()
    {
        var pages = new List<PageInfo>();

        var root = Resolve(_trailer?.Get("Root")) as PdfDictionary;

        var pagesNode = Resolve(root?.Get("Pages")) as PdfDictionary;

        if (pagesNode is null)
        {
            return pages;
        }

        var visited = new HashSet<int>();

        Visit(
            pagesNode,
            null,
            null,
            pages,
            visited,
            0);

        return pages;
    }

    private void Visit(
        PdfDictionary node,
        PdfDictionary? inheritedResources,
        double[]? inheritedMediaBox,
        List<PageInfo> pages,
        HashSet<int> visited,
        int depth)
    {
        if (depth > 64 || pages.Count > 5000)
        {
            return;
        }

        // /Resources và /MediaBox được kế thừa từ node cha.
        var resources = Resolve(node.Get("Resources")) as PdfDictionary
                        ?? inheritedResources;

        var mediaBox = ReadMediaBox(node.Get("MediaBox")) ?? inheritedMediaBox;

        if (string.Equals(
            node.GetName("Type"),
            "Page",
            StringComparison.Ordinal))
        {
            var media = mediaBox ?? new[]
            {
                0d,
                0d,
                DefaultPageWidth,
                DefaultPageHeight
            };

            pages.Add(new PageInfo
            {
                Dictionary = node,
                InheritedResources = resources,
                Width = Math.Abs(media[2] - media[0]),
                Height = Math.Abs(media[3] - media[1])
            });

            return;
        }

        if (Resolve(node.Get("Kids")) is not PdfArray kids)
        {
            return;
        }

        foreach (var kid in kids.Items)
        {
            if (Resolve(kid) is not PdfDictionary child)
            {
                continue;
            }

            if (kid is PdfReference reference)
            {
                if (!visited.Add(reference.Number))
                {
                    continue;
                }
            }

            Visit(
                child,
                resources,
                mediaBox,
                pages,
                visited,
                depth + 1);
        }
    }

    private double[]? ReadMediaBox(PdfObject? value)
    {
        if (Resolve(value) is not PdfArray array ||
            array.Items.Count < 4)
        {
            return null;
        }

        var numbers = new double[4];

        for (var index = 0; index < 4; index++)
        {
            if (Resolve(array.Items[index]) is not PdfNumber number)
            {
                return null;
            }

            numbers[index] = number.Value;
        }

        return numbers;
    }

    // =====================================================
    // ĐÓNG DẤU WATERMARK
    // =====================================================

    private void AddWatermarkToPage(
        PageInfo page,
        PdfReference fontReference,
        IReadOnlyList<WatermarkTextLine> lines)
    {
        EnsureFontResource(page, fontReference);

        var streamNumber = NewObjectNumber();

        var content = BuildWatermarkContent(page, lines);

        // Object stream mới, /Length ghi trực tiếp để không phụ thuộc
        // object khác trong file.
        var watermarkObject =
            $"<< /Length {Encoding.Latin1.GetByteCount(content)} >>\n" +
            $"stream\n{content}\nendstream";

        _objects[streamNumber] = new LoadedObject
        {
            Number = streamNumber,
            Generation = 0,
            Value = null,
            Body = watermarkObject
        };

        var streamReference = new PdfReference
        {
            Number = streamNumber,
            Generation = 0
        };

        // Giữ nguyên content stream gốc, thêm stream watermark phía sau
        // nên nội dung tài liệu không bị thay đổi.
        var original = page.Dictionary.Get("Contents");

        var contents = new PdfArray();

        if (Resolve(original) is PdfArray existing)
        {
            contents.Items.AddRange(existing.Items);
        }
        else if (original is not null)
        {
            contents.Items.Add(original);
        }

        contents.Items.Add(streamReference);

        page.Dictionary.Set("Contents", contents);
    }

    private void EnsureFontResource(
        PageInfo page,
        PdfReference fontReference)
    {
        var own = Resolve(page.Dictionary.Get("Resources")) as PdfDictionary;

        if (own is null)
        {
            // Trang không có /Resources riêng và cũng không kế thừa được.
            if (page.InheritedResources is null)
            {
                var created = new PdfDictionary
                {
                    Raw = string.Empty
                };

                created.Set(
                    "Font",
                    BuildFontDictionary(fontReference));

                var createdNumber = NewObjectNumber();

                _objects[createdNumber] = new LoadedObject
                {
                    Number = createdNumber,
                    Generation = 0,
                    Value = created,
                    Body = Serialize(created)
                };

                page.Dictionary.Set(
                    "Resources",
                    new PdfReference
                    {
                        Number = createdNumber,
                        Generation = 0
                    });

                return;
            }

            // Kế thừa từ node cha: phải copy lại resource của cha
            // rồi thêm font, nếu không trang sẽ mất tài nguyên gốc.
            var copy = new PdfDictionary
            {
                Raw = string.Empty
            };

            foreach (var entry in page.InheritedResources.Entries)
            {
                copy.Set(entry.Key, entry.Value);
            }

            copy.Set("Font", MergeFontResource(
                Resolve(page.InheritedResources.Get("Font")),
                fontReference));

            var copyNumber = NewObjectNumber();

            _objects[copyNumber] = new LoadedObject
            {
                Number = copyNumber,
                Generation = 0,
                Value = copy,
                Body = Serialize(copy)
            };

            page.Dictionary.Set(
                "Resources",
                new PdfReference
                {
                    Number = copyNumber,
                    Generation = 0
                });

            return;
        }

        // /Resources của trang đã tồn tại, thêm font vào đó.
        var fontValue = Resolve(own.Get("Font"));

        if (fontValue is PdfDictionary fonts)
        {
            fonts.Set(FontResourceName, fontReference);
        }
        else
        {
            own.Set("Font", BuildFontDictionary(fontReference));
        }
    }

    // Giữ lại font của tài liệu gốc rồi thêm font watermark,
    // nếu không trang sẽ không hiển thị được nội dung gốc.
    private PdfDictionary MergeFontResource(
        PdfObject? inheritedFont,
        PdfReference fontReference)
    {
        var fonts = new PdfDictionary
        {
            Raw = string.Empty
        };

        if (inheritedFont is PdfDictionary existing)
        {
            foreach (var entry in existing.Entries)
            {
                fonts.Set(entry.Key, entry.Value);
            }
        }

        fonts.Set(FontResourceName, fontReference);

        return fonts;
    }

    private PdfDictionary BuildFontDictionary(PdfReference fontReference)
    {
        var fonts = new PdfDictionary
        {
            Raw = string.Empty
        };

        fonts.Set(FontResourceName, fontReference);

        return fonts;
    }

    private static string BuildWatermarkContent(
        PageInfo page,
        IReadOnlyList<WatermarkTextLine> lines)
    {
        // Chữ chạy chéo 45 độ, màu xám nhạt để không che nội dung.
        const double angle = -45d * Math.PI / 180d;

        var cos = Math.Cos(angle);
        var sin = Math.Sin(angle);

        var centerX = page.Width / 2d;
        var centerY = page.Height / 2d;

        var builder = new StringBuilder();

        // Content stream gốc và stream này được nối với nhau,
        // phải có khoảng trắng để không dính hai toán tử.
        builder.Append("\nq\n");
        builder.Append("0.8 0.8 0.8 rg\n");

        var offset = 0d;

        foreach (var line in lines)
        {
            var text = WatermarkTextFactory.ToPdfStringContent(line.Text);

            if (text.Length == 0)
            {
                continue;
            }

            var fontSize = line.FontSize;

            var textWidth = text.Length * fontSize * AverageGlyphRatio;

            // Lệch mỗi dòng theo phương vuông góc với hướng chữ.
            offset += fontSize * 0.9d;

            var lineCenterX = centerX - sin * offset;
            var lineCenterY = centerY + cos * offset;

            var x = lineCenterX - cos * textWidth / 2d - sin * fontSize * 0.3d;
            var y = lineCenterY - sin * textWidth / 2d - cos * fontSize * 0.3d;

            builder.Append("BT\n");
            builder.Append(
                $"/{FontResourceName} {Format(fontSize)} Tf\n");
            builder.Append(
                string.Format(
                    CultureInfo.InvariantCulture,
                    "{0} {1} {2} {3} {4} {5} Tm\n",
                    cos,
                    sin,
                    -sin,
                    cos,
                    x,
                    y));
            builder.Append($"({text}) Tj\n");
            builder.Append("ET\n");
        }

        builder.Append("Q\n");

        return builder.ToString();
    }

    private int NewObjectNumber()
    {
        return _nextObjectNumber++;
    }

    // =====================================================
    // GHI FILE
    // =====================================================

    private byte[] Write()
    {
        using var output = new MemoryStream();

        var header = ReadHeader();

        WriteText(output, header);
        WriteText(output, "\n");

        // Ký tự nhị phân giúp công cụ xử lý file như binary.
        WriteText(output, "%\u00E2\u00E3\u00CF\u00D3\n");

        var written = new List<LoadedObject>();

        foreach (var number in _objects.Keys.OrderBy(item => item))
        {
            var loaded = _objects[number];

            if (ShouldSkip(loaded))
            {
                continue;
            }

            written.Add(loaded);
        }

        var offsets = new Dictionary<int, long>();

        foreach (var loaded in written)
        {
            offsets[loaded.Number] = output.Position;

            WriteText(
                output,
                $"{loaded.Number} {loaded.Generation} obj\n");

            var body = loaded.Value is not null
                ? Serialize(loaded.Value)
                : loaded.Body;

            WriteText(output, body);

            WriteText(output, "\nendobj\n");
        }

        var xrefOffset = output.Position;

        WriteText(output, "xref\n");

        // Object 0 luôn là free entry.
        WriteText(output, "0 1\n");
        WriteText(output, "0000000000 65535 f \n");

        var index = 0;

        while (index < written.Count)
        {
            var run = new List<LoadedObject> { written[index] };

            var next = index + 1;

            while (next < written.Count &&
                   written[next].Number == run[^1].Number + 1)
            {
                run.Add(written[next]);

                next++;
            }

            WriteText(
                output,
                $"{run[0].Number} {run.Count}\n");

            foreach (var item in run)
            {
                WriteText(
                    output,
                    $"{offsets[item.Number].ToString("D10", CultureInfo.InvariantCulture)} {item.Generation.ToString("D5", CultureInfo.InvariantCulture)} n \n");
            }

            index = next;
        }

        var maxNumber = written.Count == 0
            ? 0
            : written[^1].Number;

        var trailer = new StringBuilder();

        trailer.Append("trailer\n<< ");
        trailer.Append($"/Size {maxNumber + 1} ");

        if (_trailer?.Get("Root") is PdfReference root)
        {
            trailer.Append(
                $"/Root {root.Number} {root.Generation} R ");
        }

        if (_trailer?.Get("Info") is PdfReference info)
        {
            trailer.Append(
                $"/Info {info.Number} {info.Generation} R ");
        }

        // Giữ nguyên /ID để viewer nhận diện đúng tài liệu.
        if (_trailer?.Get("ID") is PdfArray id)
        {
            trailer.Append("/ID [");

            trailer.Append(
                string.Join(
                    " ",
                    id.Items.Select(Serialize)));

            trailer.Append("] ");
        }

        trailer.Append($">>\nstartxref\n{xrefOffset}\n%%EOF\n");

        WriteText(output, trailer.ToString());

        return output.ToArray();
    }

    // Object stream và xref stream không còn cần sau khi
    // đã mở rộng object, bỏ đi để file dùng bảng xref kinh điển.
    private bool ShouldSkip(LoadedObject loaded)
    {
        if (loaded.Value is not PdfStream stream)
        {
            return false;
        }

        var type = stream.Dictionary.GetName("Type");

        return string.Equals(type, "ObjStm", StringComparison.Ordinal) ||
               string.Equals(type, "XRef", StringComparison.Ordinal);
    }

    private string ReadHeader()
    {
        var index = _source.IndexOf("%PDF-", StringComparison.Ordinal);

        if (index < 0)
        {
            return "%PDF-1.4";
        }

        var end = index;

        while (end < _source.Length &&
               _source[end] is not '\r' and not '\n')
        {
            end++;
        }

        return _source.Substring(index, end - index);
    }

    private static void WriteText(Stream output, string text)
    {
        var bytes = Encoding.Latin1.GetBytes(text);

        output.Write(bytes, 0, bytes.Length);
    }

    // =====================================================
    // GHI OBJECT
    // =====================================================

    private static string Serialize(PdfObject value)
    {
        return value switch
        {
            PdfNull => "null",

            PdfBoolean boolean => boolean.Raw.Length > 0
                ? boolean.Raw
                : boolean.Value ? "true" : "false",

            PdfNumber number => number.Raw.Length > 0
                ? number.Raw
                : Format(number.Value),

            PdfName name => name.Raw.Length > 0
                ? name.Raw
                : "/" + EscapeName(name.Value),

            PdfString text => text.Raw.Length > 0
                ? text.Raw
                : "(" + EscapeString(text.Value) + ")",

            PdfReference reference =>
                $"{reference.Number} {reference.Generation} R",

            PdfArray array => SerializeArray(array),

            PdfDictionary dictionary => SerializeDictionary(dictionary),

            PdfStream stream =>
                SerializeDictionary(stream.Dictionary) +
                "\nstream\n" +
                Encoding.Latin1.GetString(stream.Data) +
                "\nendstream",

            _ => "null"
        };
    }

    private static string SerializeArray(PdfArray array)
    {
        var builder = new StringBuilder("[");

        foreach (var item in array.Items)
        {
            builder.Append(' ');

            builder.Append(Serialize(item));
        }

        builder.Append(" ]");

        return builder.ToString();
    }

    private static string SerializeDictionary(PdfDictionary dictionary)
    {
        var builder = new StringBuilder("<<");

        foreach (var entry in dictionary.Entries)
        {
            builder.Append(' ');

            builder.Append('/');

            builder.Append(EscapeName(entry.Key));

            builder.Append(' ');

            builder.Append(Serialize(entry.Value));
        }

        builder.Append(" >>");

        return builder.ToString();
    }

    private static string EscapeName(string value)
    {
        var builder = new StringBuilder();

        foreach (var character in value)
        {
            if (character > 0x20 &&
                character < 0x7F &&
                !IsNameDelimiter(character))
            {
                builder.Append(character);
            }
            else
            {
                builder.Append(
                    $"#{((int)character).ToString("X2", CultureInfo.InvariantCulture)}");
            }
        }

        return builder.ToString();
    }

    private static string EscapeString(string value)
    {
        var builder = new StringBuilder();

        foreach (var character in value)
        {
            switch (character)
            {
                case '(':
                    builder.Append("\\(");
                    break;

                case ')':
                    builder.Append("\\)");
                    break;

                case '\\':
                    builder.Append("\\\\");
                    break;

                case '\r':
                    builder.Append("\\r");
                    break;

                case '\n':
                    builder.Append("\\n");
                    break;

                default:
                    if (character < 0x20 || character > 0x7E)
                    {
                        builder.Append(
                            $"\\{((int)character).ToString("D3", CultureInfo.InvariantCulture)}");
                    }
                    else
                    {
                        builder.Append(character);
                    }

                    break;
            }
        }

        return builder.ToString();
    }

    private static bool IsNameDelimiter(char value)
    {
        return PdfObjectParser.IsDelimiter(value) ||
               value == '#' ||
               value == '\'' ||
               value == '"';
    }

    private static string Format(double value)
    {
        return value.ToString(
            "0.####",
            CultureInfo.InvariantCulture);
    }

    // =====================================================
    // TIỆN ÍCH
    // =====================================================

    private PdfObject? Resolve(PdfObject? value)
    {
        var current = value;

        var guard = 0;

        while (current is PdfReference reference && guard++ < 32)
        {
            if (!_objects.TryGetValue(reference.Number, out var loaded))
            {
                return null;
            }

            current = loaded.Value;
        }

        return current;
    }

    private bool Fail(string message)
    {
        Error = message;

        return false;
    }
}
