using System.Globalization;
using System.IO.Compression;
using System.Text;
using System.Text.RegularExpressions;

namespace CampusEcomSystemMini.Infrastructure.Services.Document.Watermark;

// Đóng dấu watermark lên file DOCX bằng C# thuần.
//
// DOCX là file ZIP theo chuẩn Open XML.
// Watermark chuẩn của Word là một shape VML nằm trong header,
// nên batch này chèn shape đó vào header của tài liệu:
//   - Tài liệu đã có header -> chèn vào các header đó.
//   - Chưa có header -> tạo header mới, khai báo quan hệ
//     trong word/_rels/document.xml.rels và khai báo content type.
internal static class DocxWatermarkWriter
{
    private const string DocumentPartName = "word/document.xml";

    private const string RelationshipsPartName =
        "word/_rels/document.xml.rels";

    private const string ContentTypesPartName = "[Content_Types].xml";

    private const string HeaderPartPrefix = "word/header";

    private const string HeaderRelationshipType =
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header";

    private const string HeaderContentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml";

    private const string NewHeaderPartName = "word/headerWatermark.xml";

    private const string NewRelationshipId = "rIdWatermark1";

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
            using var source = new MemoryStream(content);

            using var output = new MemoryStream();

            using (var sourceArchive = new ZipArchive(
                source,
                ZipArchiveMode.Read,
                true))
            using (var outputArchive = new ZipArchive(
                output,
                ZipArchiveMode.Create,
                true))
            {
                Apply(
                    sourceArchive,
                    outputArchive,
                    lines);
            }

            result = output.ToArray();

            return true;
        }
        catch (InvalidDataException exception)
        {
            error =
                $"File DOCX không hợp lệ, không thể đóng dấu watermark: {exception.Message}";

            return false;
        }
        catch (Exception exception)
        {
            error =
                $"Không thể đóng dấu watermark cho file DOCX: {exception.Message}";

            return false;
        }
    }

    private static void Apply(
        ZipArchive source,
        ZipArchive output,
        IReadOnlyList<WatermarkTextLine> lines)
    {
        var documentEntry = source.GetEntry(DocumentPartName);

        if (documentEntry is null)
        {
            throw new InvalidDataException(
                "Thiếu word/document.xml trong file DOCX.");
        }

        var headerNames = source.Entries
            .Select(entry => entry.FullName)
            .Where(name => name.StartsWith(
                HeaderPartPrefix,
                StringComparison.OrdinalIgnoreCase) &&
                name.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
            .ToList();

        // [Content_Types].xml phải nằm trong file.
        var contentTypes = source.GetEntry(ContentTypesPartName);

        WriteEntry(
            output,
            ContentTypesPartName,
            headerNames.Count == 0
                ? AddHeaderContentType(ReadText(contentTypes))
                : ReadText(contentTypes));

        var documentXml = headerNames.Count == 0
            ? AddHeaderReference(ReadText(documentEntry))
            : ReadText(documentEntry);

        var relationships = source.GetEntry(RelationshipsPartName);

        WriteEntry(
            output,
            RelationshipsPartName,
            headerNames.Count == 0
                ? AddHeaderRelationship(ReadText(relationships))
                : ReadText(relationships));

        WriteEntry(output, DocumentPartName, documentXml);

        if (headerNames.Count == 0)
        {
            // Tạo header mới chứa watermark.
            WriteEntry(
                output,
                NewHeaderPartName,
                BuildHeaderXml(lines, 0));

            return;
        }

        foreach (var entry in source.Entries)
        {
            if (entry.FullName == DocumentPartName ||
                entry.FullName == RelationshipsPartName ||
                entry.FullName == ContentTypesPartName)
            {
                continue;
            }

            if (headerNames.Contains(
                entry.FullName,
                StringComparer.OrdinalIgnoreCase))
            {
                // Chèn watermark vào header đã có sẵn.
                WriteEntry(
                    output,
                    entry.FullName,
                    InsertWatermark(ReadText(entry), lines));

                continue;
            }

            CopyEntry(entry, output);
        }
    }

    // =====================================================
    // HEADER MỚI
    // =====================================================

    private static string AddHeaderContentType(string contentTypes)
    {
        if (contentTypes.Contains(
            NewHeaderPartName,
            StringComparison.OrdinalIgnoreCase))
        {
            return contentTypes;
        }

        var overrideXml =
            $"<Override PartName=\"/{NewHeaderPartName}\" " +
            $"ContentType=\"{HeaderContentType}\" />";

        return InsertBeforeClosingTag(contentTypes, "Types", overrideXml);
    }

    private static string AddHeaderRelationship(string relationships)
    {
        if (relationships.Contains(
            $"Id=\"{NewRelationshipId}\"",
            StringComparison.Ordinal))
        {
            return relationships;
        }

        var relationshipXml =
            $"<Relationship Id=\"{NewRelationshipId}\" " +
            $"Type=\"{HeaderRelationshipType}\" " +
            $"Target=\"{NewHeaderPartName["word/".Length..]}\" />";

        return InsertBeforeClosingTag(
            relationships,
            "Relationships",
            relationshipXml);
    }

    // Thêm headerReference vào mọi section của tài liệu.
    private static string AddHeaderReference(string documentXml)
    {
        var reference =
            $"<w:headerReference w:type=\"default\" " +
            $"r:id=\"{NewRelationshipId}\" />";

        var referencePattern = new Regex(
            "<w:sectPr(\\s[^>]*)?>",
            RegexOptions.None,
            TimeSpan.FromSeconds(2));

        var matches = referencePattern.Matches(documentXml);

        if (matches.Count == 0)
        {
            // Tài liệu không có section nào thì thêm section cuối file.
            var section =
                $"<w:sectPr>{reference}</w:sectPr>";

            var bodyEnd = documentXml.LastIndexOf(
                "</w:body>",
                StringComparison.Ordinal);

            if (bodyEnd < 0)
            {
                throw new InvalidDataException(
                    "Thiếu thẻ w:body trong word/document.xml.");
            }

            return documentXml.Insert(bodyEnd, section);
        }

        // headerReference phải nằm đầu w:sectPr theo thứ tự schema.
        var builder = new StringBuilder(documentXml);

        for (var index = matches.Count - 1; index >= 0; index--)
        {
            var match = matches[index];

            // Bỏ qua sectPr nằm trong pPr, thứ tự schema vẫn hợp lệ.
            builder.Insert(match.Index + match.Length, reference);
        }

        return builder.ToString();
    }

    private static string InsertBeforeClosingTag(
        string xml,
        string tagName,
        string snippet)
    {
        var closingTag = $"</{tagName}>";

        var index = xml.LastIndexOf(
            closingTag,
            StringComparison.Ordinal);

        if (index < 0)
        {
            throw new InvalidDataException(
                $"Thiếu thẻ {closingTag} trong file DOCX.");
        }

        return xml.Insert(index, snippet);
    }

    // =====================================================
    // NỘI DUNG WATERMARK
    // =====================================================

    private static string BuildHeaderXml(
        IReadOnlyList<WatermarkTextLine> lines,
        int shapeSeed)
    {
        var builder = new StringBuilder();

        builder.Append(
            "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");

        builder.Append(
            "<w:hdr xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" " +
            "xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" " +
            "xmlns:v=\"urn:schemas-microsoft-com:vml\" " +
            "xmlns:o=\"urn:schemas-microsoft-com:office:office\" " +
            "xmlns:w10=\"urn:schemas-microsoft-com:office:word\">");

        builder.Append(BuildHeaderBody(lines, shapeSeed));

        builder.Append("</w:hdr>");

        return builder.ToString();
    }

    private static string BuildHeaderBody(
        IReadOnlyList<WatermarkTextLine> lines,
        int shapeSeed)
    {
        var builder = new StringBuilder();

        builder.Append("<w:p><w:pPr><w:jc w:val=\"center\" /></w:pPr>");

        builder.Append(BuildShape(lines, shapeSeed));

        builder.Append("</w:p>");

        return builder.ToString();
    }

    // Chèn watermark vào đầu header đã có sẵn.
    private static string InsertWatermark(
        string headerXml,
        IReadOnlyList<WatermarkTextLine> lines)
    {
        var openTag = headerXml.IndexOf(
            "<w:hdr",
            StringComparison.OrdinalIgnoreCase);

        if (openTag < 0)
        {
            return BuildHeaderXml(lines, 0);
        }

        var openTagEnd = headerXml.IndexOf('>', openTag);

        if (openTagEnd < 0)
        {
            return BuildHeaderXml(lines, 0);
        }

        return headerXml.Insert(
            openTagEnd + 1,
            BuildHeaderBody(lines, 0));
    }

    private static string BuildShape(
        IReadOnlyList<WatermarkTextLine> lines,
        int shapeSeed)
    {
        var builder = new StringBuilder();

        builder.Append("<w:r><w:pict>");

        builder.Append(ShapeTypeXml);

        var offset = 0d;

        var index = 0;

        foreach (var line in lines)
        {
            if (string.IsNullOrWhiteSpace(line.Text))
            {
                continue;
            }

            index++;

            // Font 1pt nhưng shape tự co giãn theo khung
            // nên cỡ chữ thật là chiều cao của shape.
            var height = line.FontSize * 2.4d;

            var width = Math.Max(
                height * 3d,
                line.Text.Length * line.FontSize * 0.62d);

            builder.Append(
                string.Format(
                    CultureInfo.InvariantCulture,
                    "<v:shape id=\"PowerPlusWaterMarkObject{0}\" " +
                    "o:spid=\"_x0000_s{1}\" type=\"#_x0000_t136\" " +
                    "style=\"position:absolute;margin-left:0;margin-top:{2}pt;" +
                    "width:{3}pt;height:{4}pt;rotation:315;z-index:-251658752;" +
                    "mso-position-horizontal:center;" +
                    "mso-position-horizontal-relative:margin;" +
                    "mso-position-vertical:center;" +
                    "mso-position-vertical-relative:margin\" " +
                    "o:allowincell=\"f\" fillcolor=\"#c8c8c8\" stroked=\"f\">",
                    shapeSeed + index,
                    2049 + shapeSeed + index,
                    offset.ToString("0.##", CultureInfo.InvariantCulture),
                    width.ToString("0.##", CultureInfo.InvariantCulture),
                    height.ToString("0.##", CultureInfo.InvariantCulture)));

            builder.Append("<v:fill opacity=\".5\" />");

            builder.Append(
                "<v:textpath on=\"t\" style=\"font-family:&quot;Calibri&quot;;" +
                "font-size:1pt\" string=\"" +
                EscapeAttribute(line.Text.Trim()) +
                "\" />");

            builder.Append("</v:shape>");

            offset += height * 0.75d;
        }

        builder.Append("</w:pict></w:r>");

        return builder.ToString();
    }

    // Shapetype WordArt chuẩn của Word (_x0000_t136).
    private const string ShapeTypeXml =
        "<v:shapetype xmlns:v=\"urn:schemas-microsoft-com:vml\" " +
        "xmlns:o=\"urn:schemas-microsoft-com:office:office\" " +
        "id=\"_x0000_t136\" coordsize=\"21600,21600\" o:spt=\"136\" " +
        "adj=\"10800\" path=\"m@7,l@8,m@5,21600l@6,21600e\">" +
        "<v:formulas>" +
        "<v:f eqn=\"sum #0 0 10800\" />" +
        "<v:f eqn=\"prod #0 2 1\" />" +
        "<v:f eqn=\"sum 21600 0 @1\" />" +
        "<v:f eqn=\"sum 0 0 @2\" />" +
        "<v:f eqn=\"sum 21600 0 @3\" />" +
        "<v:f eqn=\"if @0 @3 0\" />" +
        "<v:f eqn=\"if @0 21600 @1\" />" +
        "<v:f eqn=\"if @0 0 @2\" />" +
        "<v:f eqn=\"if @0 @4 21600\" />" +
        "<v:f eqn=\"mid @5 @6\" />" +
        "<v:f eqn=\"mid @8 @5\" />" +
        "<v:f eqn=\"mid @7 @8\" />" +
        "<v:f eqn=\"mid @6 @7\" />" +
        "<v:f eqn=\"sum @6 0 @5\" />" +
        "</v:formulas>" +
        "<v:path textpathok=\"t\" o:connecttype=\"custom\" " +
        "o:connectlocs=\"@9,0;@10,10800;@11,21600;@12,10800\" " +
        "o:connectangles=\"270,180,90,0\" />" +
        "<v:textpath on=\"t\" fitshape=\"t\" />" +
        "<v:handles>" +
        "<v:h position=\"#0,bottomRight\" xrange=\"6629,14971\" />" +
        "</v:handles>" +
        "<o:lock v:ext=\"edit\" text=\"t\" shapetype=\"t\" />" +
        "</v:shapetype>";

    private static string EscapeAttribute(string value)
    {
        var builder = new StringBuilder();

        foreach (var character in value)
        {
            switch (character)
            {
                case '&':
                    builder.Append("&amp;");
                    break;

                case '<':
                    builder.Append("&lt;");
                    break;

                case '>':
                    builder.Append("&gt;");
                    break;

                case '"':
                    builder.Append("&quot;");
                    break;

                case '\'':
                    builder.Append("&apos;");
                    break;

                case '\r':
                case '\n':
                case '\t':
                    builder.Append(' ');
                    break;

                default:
                    builder.Append(character);
                    break;
            }
        }

        return builder.ToString();
    }

    // =====================================================
    // ĐỌC / GHI ZIP
    // =====================================================

    private static string ReadText(ZipArchiveEntry? entry)
    {
        if (entry is null)
        {
            return string.Empty;
        }

        using var stream = entry.Open();

        using var reader = new StreamReader(
            stream,
            Encoding.UTF8,
            detectEncodingFromByteOrderMarks: true);

        return reader.ReadToEnd();
    }

    private static void WriteEntry(
        ZipArchive output,
        string name,
        string content)
    {
        var entry = output.CreateEntry(
            name,
            CompressionLevel.Optimal);

        using var stream = entry.Open();

        var bytes = new UTF8Encoding(false).GetBytes(content);

        stream.Write(bytes, 0, bytes.Length);
    }

    private static void CopyEntry(
        ZipArchiveEntry entry,
        ZipArchive output)
    {
        var target = output.CreateEntry(
            entry.FullName,
            CompressionLevel.Optimal);

        if (entry.LastWriteTime.Year > 1980)
        {
            target.LastWriteTime = entry.LastWriteTime;
        }

        using var sourceStream = entry.Open();

        using var targetStream = target.Open();

        sourceStream.CopyTo(targetStream);
    }
}
