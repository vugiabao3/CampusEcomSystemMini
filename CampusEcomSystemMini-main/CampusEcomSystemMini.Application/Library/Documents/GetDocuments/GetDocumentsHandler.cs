
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using CampusEcomSystemMini.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace CampusEcomSystemMini.Application.Library.Documents.GetDocuments;

public class GetDocumentsHandler
    : IRequestHandler<GetDocumentsQuery, List<GetDocumentsResponse>>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IDistributedCache _cache;
    private readonly ILogger<GetDocumentsHandler> _logger;

    private static readonly TimeSpan CacheDuration =
        TimeSpan.FromSeconds(60);

    private static readonly TimeSpan VersionDuration =
        TimeSpan.FromDays(30);

    private const string CacheVersionKey =
        "Library:Documents:List:Version";

    public GetDocumentsHandler(
        IDocumentRepository documentRepository,
        IUserRepository userRepository,
        IDistributedCache cache,
        ILogger<GetDocumentsHandler> logger)
    {
        _documentRepository = documentRepository;
        _userRepository = userRepository;
        _cache = cache;
        _logger = logger;
    }

    public async Task<List<GetDocumentsResponse>> Handle(
        GetDocumentsQuery request,
        CancellationToken cancellationToken)
    {
        var search = DocumentInput.NormalizeSearch(request.Search);
        var subject = DocumentInput.NormalizeSubject(request.Subject);

        var pricing = request.Pricing.HasValue
            ? DocumentInput.PricingTypeToString(request.Pricing.Value)
            : null;

        string? version = null;
        string? cacheKey = null;
        var cacheAvailable = true;

        // 1. Đọc version và thử lấy dữ liệu từ Redis.
        try
        {
            version = await _cache.GetStringAsync(
                CacheVersionKey,
                cancellationToken);

            if (version is null)
            {
                version = Guid.NewGuid().ToString("N");

                await _cache.SetStringAsync(
                    CacheVersionKey,
                    version,
                    new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow =
                            VersionDuration
                    },
                    cancellationToken);
            }

            cacheKey = BuildCacheKey(
                version,
                search,
                subject,
                pricing);

            var cachedJson = await _cache.GetStringAsync(
                cacheKey,
                cancellationToken);

            if (cachedJson is not null)
            {
                var cachedResult =
                    JsonSerializer.Deserialize<List<GetDocumentsResponse>>(
                        cachedJson);

                if (cachedResult is not null)
                {
                    _logger.LogInformation(
                        "Documents cache HIT. Key: {CacheKey}",
                        cacheKey);

                    return cachedResult;
                }

                // Cache chứa JSON không hợp lệ.
                await _cache.RemoveAsync(
                    cacheKey,
                    cancellationToken);
            }

            _logger.LogInformation(
                "Documents cache MISS. Key: {CacheKey}",
                cacheKey);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            // Redis lỗi thì tiếp tục lấy dữ liệu từ SQL Server.
            cacheAvailable = false;

            _logger.LogWarning(
                ex,
                "Redis cache read failed for documents. Falling back to database.");

            cacheKey = null;
        }

        // 2. Cache MISS: truy vấn database theo bộ lọc.
        var documents = await _documentRepository.GetAllAsync(
            search,
            subject,
            pricing,
            cancellationToken);

        var result = new List<GetDocumentsResponse>();

        if (documents.Count > 0)
        {
            // 3. Lấy thông tin người upload.
            var users = await _userRepository.GetAllAsync(
                cancellationToken);

            var userById = users.ToDictionary(x => x.Id);

            foreach (var document in documents)
            {
                userById.TryGetValue(
                    document.UserId,
                    out var uploader);

                result.Add(
                    new GetDocumentsResponse(
                        document.Id,
                        document.UserId,
                        uploader?.FullName ?? string.Empty,
                        document.Title,
                        document.Subject,
                        document.Description,
                        DocumentInput.PricingTypeToLabel(
                            document.PricingType),
                        document.Price,
                        document.FileName,
                        document.FileType,
                        document.FileSize,
                        document.Rating,
                        document.ReviewCount,
                        document.CreatedAt,
                        document.UpdatedAt));
            }
        }

        // 4. Giữ thứ tự kết quả ổn định.
        result = result
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        // 5. Chỉ ghi cache khi Redis đọc version/cache thành công.
        if (cacheAvailable && cacheKey is not null)
        {
            try
            {
                var json = JsonSerializer.Serialize(result);

                await _cache.SetStringAsync(
                    cacheKey,
                    json,
                    new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow =
                            CacheDuration
                    },
                    cancellationToken);

                _logger.LogInformation(
                    "Documents cache SET. Key: {CacheKey}; TTL: {TTL}s",
                    cacheKey,
                    CacheDuration.TotalSeconds);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Redis cache write failed for documents. Returning database result.");
            }
        }

        return result;
    }

    private static string BuildCacheKey(
        string version,
        string? search,
        string? subject,
        string? pricing)
    {
        var filters = string.Join(
            "|",
            search?.Trim().ToUpperInvariant() ?? string.Empty,
            subject?.Trim().ToUpperInvariant() ?? string.Empty,
            pricing?.Trim().ToUpperInvariant() ?? string.Empty);

        var hash = Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(filters)));

        return $"Library:Documents:List:v{version}:filters:{hash}";
    }
}
