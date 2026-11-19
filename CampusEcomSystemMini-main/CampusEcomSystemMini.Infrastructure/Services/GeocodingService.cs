using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using CampusEcomSystemMini.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace CampusEcomSystemMini.Infrastructure.Services
{
    public class GeocodingService : IGeocodingService
    {
        private readonly HttpClient _httpClient;
        private readonly string? _googleApiKey;
        private const string PhotonBaseAddress = "https://photon.komoot.io/api/";
        private const string GooglePlacesAutocompleteBase = "https://places.googleapis.com/v1/places:autocomplete";

        public GeocodingService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _googleApiKey = configuration["GoogleMaps:ApiKey"];
        }

        public async Task<IReadOnlyList<AddressSuggestionDto>> GetSuggestionsAsync(
            string query,
            int limit = 5,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Array.Empty<AddressSuggestionDto>();

            if (query.Length < 3)
                return Array.Empty<AddressSuggestionDto>();

            if (!string.IsNullOrEmpty(_googleApiKey))
            {
                return await GetGoogleSuggestionsAsync(query, limit, cancellationToken);
            }

            return await GetPhotonSuggestionsAsync(query, limit, cancellationToken);
        }

        private async Task<IReadOnlyList<AddressSuggestionDto>> GetGoogleSuggestionsAsync(
            string query,
            int limit,
            CancellationToken cancellationToken)
        {
            try
            {
                var requestBody = new
                {
                    textQuery = query.Trim(),
                    maxResultCount = Math.Min(limit, 20),
                    languageCode = "vi",
                    regionCode = "VN",
                    locationBias = new
                    {
                        circle = new
                        {
                            center = new { latitude = 21.0285, longitude = 105.8542 },
                            radius = 50000.0
                        }
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                using var request = new HttpRequestMessage(HttpMethod.Post, GooglePlacesAutocompleteBase);
                request.Headers.Add("X-Goog-Api-Key", _googleApiKey!);
                request.Headers.Add("X-Goog-FieldMask", "places.id,places.formattedAddress,places.primaryText,places.secondaryText,places.location");
                request.Content = content;

                var response = await _httpClient.SendAsync(request, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
                    Console.WriteLine($"[GeocodingService] Google Places Autocomplete failed: HTTP {(int)response.StatusCode} {response.StatusCode}. Body: {SafeTruncate(errorBody, 500)}");
                    return Array.Empty<AddressSuggestionDto>();
                }

                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                using JsonDocument doc = JsonDocument.Parse(responseContent);

                if (!doc.RootElement.TryGetProperty("places", out var placesArray))
                    return Array.Empty<AddressSuggestionDto>();

                var suggestions = new List<AddressSuggestionDto>();

                foreach (var place in placesArray.EnumerateArray())
                {
                    string? placeId = null;
                    string? formattedAddress = null;
                    string? mainText = null;
                    string? secondaryText = null;
                    double latitude = 0;
                    double longitude = 0;

                    if (place.TryGetProperty("id", out var idProp) && idProp.ValueKind == JsonValueKind.String)
                        placeId = idProp.GetString();

                    if (place.TryGetProperty("formattedAddress", out var fmtProp) && fmtProp.ValueKind == JsonValueKind.String)
                        formattedAddress = fmtProp.GetString();

                    if (place.TryGetProperty("primaryText", out var primaryProp) && primaryProp.ValueKind == JsonValueKind.Object)
                    {
                        if (primaryProp.TryGetProperty("text", out var primaryTextProp) && primaryTextProp.ValueKind == JsonValueKind.String)
                            mainText = primaryTextProp.GetString();
                    }

                    if (place.TryGetProperty("secondaryText", out var secondaryProp) && secondaryProp.ValueKind == JsonValueKind.Object)
                    {
                        if (secondaryProp.TryGetProperty("text", out var secondaryTextProp) && secondaryTextProp.ValueKind == JsonValueKind.String)
                            secondaryText = secondaryTextProp.GetString();
                    }

                    if (place.TryGetProperty("location", out var locationProp) && locationProp.ValueKind == JsonValueKind.Object)
                    {
                        if (locationProp.TryGetProperty("latitude", out var latProp) && latProp.ValueKind == JsonValueKind.Number)
                            latitude = latProp.GetDouble();
                        if (locationProp.TryGetProperty("longitude", out var lngProp) && lngProp.ValueKind == JsonValueKind.Number)
                            longitude = lngProp.GetDouble();
                    }

                    if (string.IsNullOrWhiteSpace(formattedAddress))
                        formattedAddress = mainText ?? secondaryText;

                    if (string.IsNullOrWhiteSpace(formattedAddress))
                        continue;

                    suggestions.Add(new AddressSuggestionDto(
                        formattedAddress,
                        latitude,
                        longitude,
                        placeId,
                        mainText,
                        secondaryText));
                }

                return suggestions;
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GeocodingService] Google Places Autocomplete exception: {ex.Message}");
                return Array.Empty<AddressSuggestionDto>();
            }
        }

        private async Task<IReadOnlyList<AddressSuggestionDto>> GetPhotonSuggestionsAsync(
            string query,
            int limit,
            CancellationToken cancellationToken)
        {
            _httpClient.BaseAddress = new Uri(PhotonBaseAddress);
            _httpClient.Timeout = TimeSpan.FromSeconds(10);

            var parameters = new Dictionary<string, string>
            {
                ["q"] = query.Trim(),
                ["limit"] = limit.ToString()
            };

            var queryString = FormUrlEncoded(parameters);
            var response = await _httpClient.GetAsync($"?{queryString}", cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                return Array.Empty<AddressSuggestionDto>();
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            using JsonDocument doc = JsonDocument.Parse(content);
            if (!doc.RootElement.TryGetProperty("features", out var featuresArray))
                return Array.Empty<AddressSuggestionDto>();

            var suggestions = new List<AddressSuggestionDto>();

            foreach (var feature in featuresArray.EnumerateArray())
            {
                if (!feature.TryGetProperty("properties", out var properties))
                    continue;

                string? formattedAddress = null;
                double latitude = 0;
                double longitude = 0;

                if (properties.TryGetProperty("name", out var nameProp) && nameProp.ValueKind == JsonValueKind.String)
                {
                    formattedAddress = nameProp.GetString();
                }

                if (string.IsNullOrWhiteSpace(formattedAddress))
                {
                    var parts = new List<string>();
                    if (properties.TryGetProperty("street", out var street) && street.ValueKind == JsonValueKind.String)
                        parts.Add(street.GetString());
                    if (properties.TryGetProperty("housenumber", out var hn) && hn.ValueKind == JsonValueKind.String)
                        parts.Add(hn.GetString());
                    if (properties.TryGetProperty("postcode", out var pc) && pc.ValueKind == JsonValueKind.String)
                        parts.Add(pc.GetString());
                    if (properties.TryGetProperty("city", out var city) && city.ValueKind == JsonValueKind.String)
                        parts.Add(city.GetString());
                    if (properties.TryGetProperty("state", out var state) && state.ValueKind == JsonValueKind.String)
                        parts.Add(state.GetString());
                    if (properties.TryGetProperty("country", out var country) && country.ValueKind == JsonValueKind.String)
                        parts.Add(country.GetString());

                    if (parts.Count > 0)
                        formattedAddress = string.Join(", ", parts);
                }

                if (string.IsNullOrWhiteSpace(formattedAddress))
                    continue;

                if (feature.TryGetProperty("geometry", out var geometry))
                {
                    longitude = 0;
                    latitude = 0;
                    bool coordsOk = false;
                    if (geometry.TryGetProperty("coordinates", out var coords))
                    {
                        if (coords.ValueKind == JsonValueKind.Array && coords.GetArrayLength() >= 2)
                        {
                            longitude = coords[0].GetDouble();
                            latitude = coords[1].GetDouble();
                            coordsOk = true;
                        }
                    }
                    if (!coordsOk)
                    {
                        continue;
                    }
                }
                else
                {
                    continue;
                }

                if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
                    continue;

                suggestions.Add(new AddressSuggestionDto(formattedAddress, latitude, longitude));
            }

            return suggestions;
        }

        public async Task<GeocodingResultDto?> GeocodeAsync(string address, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(address))
                return null;

            if (!string.IsNullOrEmpty(_googleApiKey))
            {
                return await GoogleGeocodeAsync(address, cancellationToken);
            }

            return await PhotonGeocodeAsync(address, cancellationToken);
        }

        private async Task<GeocodingResultDto?> GoogleGeocodeAsync(string address, CancellationToken cancellationToken)
        {
            try
            {
                var requestBody = new
                {
                    textQuery = address.Trim(),
                    maxResultCount = 1,
                    languageCode = "vi",
                    regionCode = "VN",
                    locationBias = new
                    {
                        circle = new
                        {
                            center = new { latitude = 21.0285, longitude = 105.8542 },
                            radius = 50000.0
                        }
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                using var request = new HttpRequestMessage(HttpMethod.Post, GooglePlacesAutocompleteBase);
                request.Headers.Add("X-Goog-Api-Key", _googleApiKey!);
                request.Headers.Add("X-Goog-FieldMask", "places.id,places.formattedAddress,places.location");
                request.Content = content;

                var response = await _httpClient.SendAsync(request, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
                    Console.WriteLine($"[GeocodingService] Google Geocode failed: HTTP {(int)response.StatusCode}. Body: {SafeTruncate(errorBody, 500)}");
                    return null;
                }

                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                using JsonDocument doc = JsonDocument.Parse(responseContent);

                if (!doc.RootElement.TryGetProperty("places", out var placesArray) ||
                    placesArray.GetArrayLength() == 0)
                    return null;

                var place = placesArray[0];

                string? formattedAddress = null;
                if (place.TryGetProperty("formattedAddress", out var fmtProp) && fmtProp.ValueKind == JsonValueKind.String)
                    formattedAddress = fmtProp.GetString();

                if (string.IsNullOrWhiteSpace(formattedAddress))
                    return null;

                double latitude = 0;
                double longitude = 0;
                if (place.TryGetProperty("location", out var locationProp) && locationProp.ValueKind == JsonValueKind.Object)
                {
                    if (locationProp.TryGetProperty("latitude", out var latProp) && latProp.ValueKind == JsonValueKind.Number)
                        latitude = latProp.GetDouble();
                    if (locationProp.TryGetProperty("longitude", out var lngProp) && lngProp.ValueKind == JsonValueKind.Number)
                        longitude = lngProp.GetDouble();
                }

                if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
                    return null;

                return new GeocodingResultDto(formattedAddress, latitude, longitude);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GeocodingService] Google Geocode exception: {ex.Message}");
                return null;
            }
        }

        private async Task<GeocodingResultDto?> PhotonGeocodeAsync(string address, CancellationToken cancellationToken)
        {
            _httpClient.BaseAddress = new Uri(PhotonBaseAddress);
            _httpClient.Timeout = TimeSpan.FromSeconds(10);

            var parameters = new Dictionary<string, string>
            {
                ["q"] = address.Trim(),
                ["limit"] = "1"
            };

            var queryString = FormUrlEncoded(parameters);
            var response = await _httpClient.GetAsync($"?{queryString}", cancellationToken);

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            using JsonDocument doc = JsonDocument.Parse(content);
            if (!doc.RootElement.TryGetProperty("features", out var featuresArray) ||
                featuresArray.GetArrayLength() == 0)
                return null;

            var feature = featuresArray[0];
            if (!feature.TryGetProperty("properties", out var properties))
                return null;

            string? formattedAddress = null;
            if (properties.TryGetProperty("name", out var nameProp) && nameProp.ValueKind == JsonValueKind.String)
                formattedAddress = nameProp.GetString();

            if (string.IsNullOrWhiteSpace(formattedAddress))
            {
                var parts = new List<string>();
                if (properties.TryGetProperty("street", out var street) && street.ValueKind == JsonValueKind.String)
                    parts.Add(street.GetString());
                if (properties.TryGetProperty("housenumber", out var hn) && hn.ValueKind == JsonValueKind.String)
                    parts.Add(hn.GetString());
                if (properties.TryGetProperty("postcode", out var pc) && pc.ValueKind == JsonValueKind.String)
                    parts.Add(pc.GetString());
                if (properties.TryGetProperty("city", out var city) && city.ValueKind == JsonValueKind.String)
                    parts.Add(city.GetString());
                if (properties.TryGetProperty("state", out var state) && state.ValueKind == JsonValueKind.String)
                    parts.Add(state.GetString());
                if (properties.TryGetProperty("country", out var country) && country.ValueKind == JsonValueKind.String)
                    parts.Add(country.GetString());

                if (parts.Count > 0)
                    formattedAddress = string.Join(", ", parts);
            }

            if (string.IsNullOrWhiteSpace(formattedAddress))
                return null;

            if (!feature.TryGetProperty("geometry", out var geometry))
                return null;

            double longitude = 0;
            double latitude = 0;
            bool coordsOk = false;
            if (geometry.TryGetProperty("coordinates", out var coords))
            {
                if (coords.ValueKind == JsonValueKind.Array && coords.GetArrayLength() >= 2)
                {
                    longitude = coords[0].GetDouble();
                    latitude = coords[1].GetDouble();
                    coordsOk = true;
                }
            }

            if (!coordsOk)
                return null;

            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
                return null;

            return new GeocodingResultDto(formattedAddress, latitude, longitude);
        }

        private static string FormUrlEncoded(IDictionary<string, string> parameters)
        {
            var pairs = new List<string>();
            foreach (var (key, value) in parameters)
            {
                pairs.Add($"{Uri.EscapeDataString(key)}={Uri.EscapeDataString(value)}");
            }
            return string.Join("&", pairs);
        }

        private static string SafeTruncate(string? value, int maxLength)
        {
            if (string.IsNullOrEmpty(value))
                return string.Empty;
            if (value.Length <= maxLength)
                return value;
            return value.Substring(0, maxLength) + "...";
        }
    }
}
