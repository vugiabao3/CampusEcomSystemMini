/// tích hợp redis vào handler 
/// 
/// 
/// 


using System.Text.Json;
using CampusEcomSystemMini.Application.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.GetPosts;

public class GetPostsHandler
    : IRequestHandler<GetPostsQuery, List<GetPostsResponse>>
{
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly IDistributedCache _cache;
    private readonly ILogger<GetPostsHandler> _logger;

    private static readonly TimeSpan CacheDuration =
        TimeSpan.FromSeconds(60);

    private static readonly TimeSpan VersionDuration =
        TimeSpan.FromDays(30);

    private const string CacheVersionKey =
        "Posts:List:Version";
    
    

    public GetPostsHandler(
        IPostRepository postRepository,
        IUserRepository userRepository,
        IDistributedCache cache,
        ILogger<GetPostsHandler> logger)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
        _cache = cache;
        _logger = logger;
    }


    // Tạo key mới Quản lý Version 

    /////////////////////////////
    /// 
    public async Task<List<GetPostsResponse>> Handle(
        GetPostsQuery request,
        CancellationToken cancellationToken)
    {
        var type = string.IsNullOrWhiteSpace(request.Type)
            ? null
            : request.Type.Trim();

        // Chuẩn hóa tham số trước khi tạo cache key.
        var time = request.Time;

        // Cache version giúp vô hiệu hóa toàn bộ biến thể
        // danh sách khi version được thay đổi sau thao tác ghi.
        string? version = null;
        string? cacheKey = null;
        var cacheAvailable = true;

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

            // Mỗi bộ lọc có cache key riêng.
            var typeKey = type is null
                ? "all"
                : Uri.EscapeDataString(type);

            var timeKey = time?.ToString() ?? "all";

            cacheKey =
                $"Posts:List:v{version}:type:{typeKey}:time:{timeKey}";


/////////// Quản lý version 
/// 


            var cachedJson = await _cache.GetStringAsync(
                cacheKey,
                cancellationToken);

            if (cachedJson is not null)
            {
                var cachedPosts =
                    JsonSerializer.Deserialize<List<GetPostsResponse>>(
                        cachedJson);

                if (cachedPosts is not null)
                {
                    _logger.LogInformation(
                        "Posts cache HIT. Key: {CacheKey}",
                        cacheKey);

                    return cachedPosts;
                }

                // Cache không đọc được JSON hợp lệ.
                await _cache.RemoveAsync(
                    cacheKey,
                    cancellationToken);
            }

            _logger.LogInformation(
                "Posts cache MISS. Key: {CacheKey}",
                cacheKey);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            // Redis lỗi thì vẫn cố lấy dữ liệu từ SQL Server.
            // Không để lỗi cache tự động làm hỏng GET /api/posts.
            cacheAvailable = false;

            _logger.LogWarning(
                ex,
                "Redis cache read failed. Falling back to database.");
        }

        //////////////////
        /// 
        /// 

        DateTime? createdFromUtc = null;
        DateTime? createdToUtc = null;

        // Giữ nguyên cách tính khoảng Today của code hiện tại.
        if (time == PostTimeFilter.Today)
        {
            var startOfToday = DateTime.Now.Date;

            createdFromUtc = startOfToday.ToUniversalTime();

            createdToUtc = startOfToday
                .AddDays(1)
                .ToUniversalTime();
        }

        //////////////////////////////
        /// 

        var posts = await _postRepository.GetAllAsync(
            type,
            createdFromUtc,
            createdToUtc,
            cancellationToken);

        var authorIds = posts
            .Select(post => post.UserId)
            .Distinct()
            .ToList();

        var authors = await _userRepository.GetByIdsAsync(
            authorIds,
            cancellationToken);

        var authorsById = authors
            .ToDictionary(user => user.Id);

        var result = posts
            .Select(post =>
            {
                authorsById.TryGetValue(
                    post.UserId,
                    out var author);

                return new GetPostsResponse(
                    post.Id,
                    post.UserId,
                    post.Title,
                    post.Content,
                    post.Type,
                    post.LibraryPostId,
                    post.CreatedAt,
                    post.UpdatedAt,
                    author?.FullName,
                    author?.AvatarUrl);
            })
            .ToList();

        // Chỉ ghi cache khi đọc cache/version thành công.
        // Nếu Redis không hoạt động, vẫn trả kết quả từ database.
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
                    "Posts cache SET. Key: {CacheKey}; TTL: {TTL}s",
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
                    "Redis cache write failed. Returning database result.");
            }
        }

        return result;
    }
}
