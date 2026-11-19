using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace CampusEcomSystemMini.Api
{
    public sealed class UtcDateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                var text = reader.GetString();
                if (DateTimeOffset.TryParse(text, out var dto))
                {
                    return dto.UtcDateTime;
                }
                if (DateTime.TryParse(text, out var dt))
                {
                    return dt.Kind == DateTimeKind.Utc ? dt : DateTime.SpecifyKind(dt, DateTimeKind.Utc);
                }
            }
            throw new JsonException($"Unable to convert '{reader.GetString()}' to DateTime.");
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            var dto = new DateTimeOffset(value, TimeSpan.Zero);
            writer.WriteStringValue(dto.ToString("o"));
        }
    }
}
