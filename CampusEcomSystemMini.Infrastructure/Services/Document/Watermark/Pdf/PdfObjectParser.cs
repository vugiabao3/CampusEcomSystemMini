using System.Globalization;
using System.Text;

namespace CampusEcomSystemMini.Infrastructure.Services.Document.Watermark.Pdf;

// Bộ phân tích object của PDF.
//
// Đọc trực tiếp trên chuỗi Latin-1 của toàn bộ file nên
// mọi byte trong content stream được giữ nguyên khi ghi lại.
internal sealed class PdfObjectParser
{
    private static readonly char[] Delimiters =
    [
        ' ',
        '\t',
        '\r',
        '\n',
        '\f',
        '\0',
        '(',
        ')',
        '<',
        '>',
        '[',
        ']',
        '{',
        '}',
        '/',
        '%'
    ];

    private readonly string _source;

    private int _position;

    public PdfObjectParser(string source, int position = 0)
    {
        _source = source;

        _position = position;
    }

    public int Position => _position;

    public bool AtEnd => _position >= _source.Length;

    public void MoveTo(int position)
    {
        _position = position;
    }

    public void SkipWhitespace()
    {
        while (_position < _source.Length)
        {
            var current = _source[_position];

            if (current == '%')
            {
                // Comment của PDF kết thúc ở ký tự xuống dòng.
                while (_position < _source.Length &&
                       _source[_position] is not '\r' and not '\n')
                {
                    _position++;
                }

                continue;
            }

            if (!IsWhitespace(current))
            {
                return;
            }

            _position++;
        }
    }

    public static bool IsWhitespace(char value)
    {
        return value is ' ' or '\t' or '\r' or '\n' or '\f' or '\0';
    }

    public static bool IsDelimiter(char value)
    {
        return IsWhitespace(value) || Array.IndexOf(Delimiters, value) >= 0;
    }

    // Đọc một object. Trả về null nếu gặp toán tử hoặc dữ liệu
    // không phải object (ví dụ toán tử trong content stream).
    public PdfObject? ReadObject()
    {
        SkipWhitespace();

        if (AtEnd)
        {
            return null;
        }

        var start = _position;

        var current = _source[_position];

        switch (current)
        {
            case '<':
                return _position + 1 < _source.Length &&
                       _source[_position + 1] == '<'
                    ? ReadDictionary()
                    : ReadHexString();

            case '[':
                return ReadArray();

            case '(':
                return ReadLiteralString();

            case '/':
                return ReadName();

            case ']':
            case '>':
            case ')':
            case '}':
            case '{':
                return null;

            case 't':
            case 'f':
            case 'n':
                return ReadBooleanOrNull();

            default:
                if (IsNumberStart(current))
                {
                    return ReadNumberOrReference();
                }

                // Bỏ qua ký tự lạ, ví dụ toán tử của content stream.
                _position++;

                return null;
        }
    }

    // Đọc keyword, ví dụ stream / endstream / endobj / R / trailer.
    public bool ReadKeyword(string keyword)
    {
        SkipWhitespace();

        if (_position + keyword.Length > _source.Length)
        {
            return false;
        }

        if (string.CompareOrdinal(
            _source,
            _position,
            keyword,
            0,
            keyword.Length) != 0)
        {
            return false;
        }

        var end = _position + keyword.Length;

        if (end < _source.Length && !IsDelimiter(_source[end]))
        {
            return false;
        }

        _position = end;

        return true;
    }

    private static bool IsNumberStart(char value)
    {
        return char.IsDigit(value) ||
               value is '+' or '-' or '.';
    }

    private PdfObject? ReadBooleanOrNull()
    {
        if (ReadKeyword("true"))
        {
            return new PdfBoolean
            {
                Value = true,
                Raw = "true"
            };
        }

        if (ReadKeyword("false"))
        {
            return new PdfBoolean
            {
                Value = false,
                Raw = "false"
            };
        }

        if (ReadKeyword("null"))
        {
            return PdfNull.Instance;
        }

        _position++;

        return null;
    }

    private PdfObject? ReadNumberOrReference()
    {
        var start = _position;

        if (!TryReadNumber(out var first))
        {
            _position = start + 1;

            return null;
        }

        var afterFirst = _position;

        // Tham chiếu dạng: 12 0 R
        // Giữa các số có thể có khoảng trắng hoặc comment.
        if (IsInteger(first))
        {
            SkipWhitespace();

            if (TryReadNumber(out var second) && IsInteger(second))
            {
                var beforeKeyword = _position;

                if (ReadKeyword("R"))
                {
                    return new PdfReference
                    {
                        Number = (int)first,
                        Generation = (int)second,
                        Raw = _source.Substring(
                            start,
                            _position - start)
                    };
                }

                _position = beforeKeyword;
            }
        }

        _position = afterFirst;

        return new PdfNumber
        {
            Value = first,
            Raw = _source.Substring(start, afterFirst - start)
        };
    }

    private static bool IsInteger(double value)
    {
        return Math.Abs(value % 1) < double.Epsilon;
    }

    private bool TryReadNumber(out double value)
    {
        var start = _position;

        while (_position < _source.Length)
        {
            var current = _source[_position];

            if (char.IsDigit(current) ||
                current is '+' or '-' or '.')
            {
                _position++;

                continue;
            }

            break;
        }

        var raw = _source.Substring(
            start,
            _position - start);

        return double.TryParse(
            raw,
            NumberStyles.Float,
            CultureInfo.InvariantCulture,
            out value);
    }

    private PdfObject ReadName()
    {
        var start = _position;

        _position++;

        var value = new StringBuilder();

        while (_position < _source.Length)
        {
            var current = _source[_position];

            if (IsDelimiter(current))
            {
                break;
            }

            if (current == '#' &&
                _position + 2 < _source.Length)
            {
                var hex = _source.Substring(_position + 1, 2);

                if (byte.TryParse(
                    hex,
                    NumberStyles.HexNumber,
                    CultureInfo.InvariantCulture,
                    out var decoded))
                {
                    value.Append((char)decoded);

                    _position += 3;

                    continue;
                }
            }

            value.Append(current);

            _position++;
        }

        return new PdfName
        {
            Value = value.ToString(),
            Raw = _source.Substring(start, _position - start)
        };
    }

    private PdfObject ReadLiteralString()
    {
        var start = _position;

        _position++;

        var depth = 1;

        var value = new StringBuilder();

        while (_position < _source.Length && depth > 0)
        {
            var current = _source[_position];

            if (current == '\\')
            {
                _position++;

                if (_position >= _source.Length)
                {
                    break;
                }

                var escaped = _source[_position];

                switch (escaped)
                {
                    case 'n':
                        value.Append('\n');
                        _position++;
                        break;

                    case 'r':
                        value.Append('\r');
                        _position++;
                        break;

                    case 't':
                        value.Append('\t');
                        _position++;
                        break;

                    case 'b':
                        value.Append('\b');
                        _position++;
                        break;

                    case 'f':
                        value.Append('\f');
                        _position++;
                        break;

                    case '(':
                    case ')':
                    case '\\':
                        value.Append(escaped);
                        _position++;
                        break;

                    case '\r':
                        // Escape nối dòng.
                        _position++;

                        if (_position < _source.Length &&
                            _source[_position] == '\n')
                        {
                            _position++;
                        }

                        break;

                    case '\n':
                        _position++;
                        break;

                    default:
                        if (char.IsDigit(escaped) &&
                            _position + 2 < _source.Length)
                        {
                            var octal = _source.Substring(
                                _position,
                                3);

                            if (int.TryParse(
                                octal,
                                NumberStyles.Integer,
                                CultureInfo.InvariantCulture,
                                out var code))
                            {
                                value.Append((char)code);

                                _position += 3;

                                break;
                            }
                        }

                        value.Append(escaped);
                        _position++;
                        break;
                }

                continue;
            }

            if (current == '(')
            {
                depth++;
            }
            else if (current == ')')
            {
                depth--;

                if (depth == 0)
                {
                    _position++;

                    break;
                }
            }

            value.Append(current);

            _position++;
        }

        return new PdfString
        {
            Value = value.ToString(),
            Raw = _source.Substring(start, _position - start)
        };
    }

    private PdfObject ReadHexString()
    {
        var start = _position;

        _position++;

        var value = new StringBuilder();

        var digits = 0;

        while (_position < _source.Length &&
               _source[_position] != '>')
        {
            var current = _source[_position];

            if (Uri.IsHexDigit(current))
            {
                value.Append(current);

                digits++;
            }

            _position++;
        }

        if (_position < _source.Length)
        {
            _position++;
        }

        if (digits % 2 == 1)
        {
            value.Append('0');
        }

        var bytes = new byte[value.Length / 2];

        for (var index = 0; index < bytes.Length; index++)
        {
            bytes[index] = byte.Parse(
                value.ToString(index * 2, 2),
                NumberStyles.HexNumber,
                CultureInfo.InvariantCulture);
        }

        return new PdfString
        {
            Value = Encoding.Latin1.GetString(bytes),
            Raw = _source.Substring(start, _position - start)
        };
    }

    private PdfObject ReadArray()
    {
        var start = _position;

        _position++;

        var array = new PdfArray();

        while (true)
        {
            SkipWhitespace();

            if (AtEnd)
            {
                break;
            }

            if (_source[_position] == ']')
            {
                _position++;

                break;
            }

            var before = _position;

            var item = ReadObject();

            if (item is not null)
            {
                array.Items.Add(item);
            }

            // Không tiến được thì bỏ qua một ký tự để tránh lặp vô hạn.
            if (_position == before)
            {
                _position++;
            }
        }

        array.Raw = _source.Substring(start, _position - start);

        return array;
    }

    private PdfObject ReadDictionary()
    {
        var start = _position;

        _position += 2;

        var dictionary = new PdfDictionary();

        while (true)
        {
            SkipWhitespace();

            if (AtEnd)
            {
                break;
            }

            if (_source[_position] == '>')
            {
                _position++;

                if (_position < _source.Length &&
                    _source[_position] == '>')
                {
                    _position++;
                }

                break;
            }

            if (_source[_position] != '/')
            {
                var before = _position;

                if (ReadObject() is null && _position == before)
                {
                    _position++;
                }

                continue;
            }

            var key = ReadName() as PdfName;

            var value = ReadObject();

            if (key is not null && value is not null)
            {
                dictionary.Set(key.Value, value);
            }
        }

        dictionary.Raw = _source.Substring(start, _position - start);

        return dictionary;
    }
}
