using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CampusEcomSystemMini.Application.Interfaces
{
    public interface IGeocodingService
    {
        Task<IReadOnlyList<AddressSuggestionDto>> GetSuggestionsAsync(string query, int limit = 5, CancellationToken cancellationToken = default);
        Task<GeocodingResultDto?> GeocodeAsync(string address, CancellationToken cancellationToken = default);
    }

    public record AddressSuggestionDto(
        string FormattedAddress,
        double Latitude,
        double Longitude,
        string? PlaceId = null,
        string? MainText = null,
        string? SecondaryText = null
    );

    public record GeocodingResultDto(string FormattedAddress, double Latitude, double Longitude);
}
