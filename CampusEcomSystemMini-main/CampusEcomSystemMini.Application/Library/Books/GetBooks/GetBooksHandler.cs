
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using CampusEcomSystemMini.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace CampusEcomSystemMini.Application.Library.Books.GetBooks;

public class GetBooksHandler
    : IRequestHandler<GetBooksQuery, List<GetBooksResponse>>
{
    private readonly IBookExchangeRepository _bookExchangeRepository;
    private readonly IUserRepository _userRepository;
    private readonly IDistributedCache _cache;
    private readonly ILogger<GetBooksHandler> _logger;

    private static readonly TimeSpan CacheDuration =
        TimeSpan.FromSeconds(60);

    private static readonly TimeSpan VersionDuration =
        TimeSpan.FromDays(30);

    private const string CacheVersionKey =
        "Library:Books:List:Version";

    public GetBooksHandler(
        IBookExchangeRepository bookExchangeRepository,
        IUserRepository userRepository,
        IDistributedCache cache,
        ILogger<GetBooksHandler> logger)
    {
        _bookExchangeRepository = bookExchangeRepository;
        _userRepository = userRepository;
        _cache = cache;
        _logger = logger;
    }

    public async Task<List<GetBooksResponse>> Handle(
        GetBooksQuery request,
        CancellationToken cancellationToken)
    {
        var search = BookInput.NormalizeSearch(request.Search);
        var status = BookInput.NormalizeStatus(request.Status);

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

            cacheKey = BuildCacheKey(search, status, version);

            var cachedJson = await _cache.GetStringAsync(
                cacheKey,
                cancellationToken);

            if (cachedJson is not null)
            {
                var cachedBooks =
                    JsonSerializer.Deserialize<List<GetBooksResponse>>(
                        cachedJson);

                if (cachedBooks is not null)
                {
                    _logger.LogInformation(
                        "Books cache HIT. Key: {CacheKey}",
                        cacheKey);

                    return cachedBooks;
                }

                // Cache chứa JSON không hợp lệ.
                await _cache.RemoveAsync(
                    cacheKey,
                    cancellationToken);
            }

            _logger.LogInformation(
                "Books cache MISS. Key: {CacheKey}",
                cacheKey);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            cacheAvailable = false;

            _logger.LogWarning(
                ex,
                "Redis cache read failed for books. Falling back to database.");

            cacheKey = null;
        }

        // 2. Cache MISS: truy vấn database theo bộ lọc.
        var posts = await _bookExchangeRepository.GetAllAsync(
            search,
            status,
            cancellationToken);

        List<GetBooksResponse> result;

        if (posts.Count == 0)
        {
            result = [];
        }
        else
        {
            // 3. Lấy thông tin người đăng.
            var users = await _userRepository.GetAllAsync(
                cancellationToken);

            var userById = users.ToDictionary(x => x.Id);

            result = new List<GetBooksResponse>();

            foreach (var post in posts)
            {
                userById.TryGetValue(post.UserId, out var owner);

                result.Add(
                    new GetBooksResponse(
                        post.Id,
                        post.UserId,
                        owner?.FullName ?? string.Empty,
                        post.BookName,
                        post.WantedBookName,
                        post.Condition,
                        post.Description,
                        post.Status,
                        post.CreatedAt));
            }
        }

        // 4. Chỉ ghi cache khi Redis đọc version/cache thành công.
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
                    "Books cache SET. Key: {CacheKey}; TTL: {TTL}s",
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
                    "Redis cache write failed for books. Returning database result.");
            }
        }

        return result;
    }

    private static string BuildCacheKey(
        string? search,
        string? status,
        string version)
    {
        var filters = string.Join(
            "|",
            search?.Trim().ToUpperInvariant() ?? string.Empty,
            status?.Trim().ToUpperInvariant() ?? string.Empty);

        var hash = Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(filters)));

        return $"Library:Books:List:v{version}:filters:{hash}";
    }
}
