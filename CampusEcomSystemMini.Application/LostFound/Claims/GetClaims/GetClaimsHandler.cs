using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.GetClaims;

public class GetClaimsHandler
    : IRequestHandler<GetClaimsQuery, GetClaimsResult>
{
    private const string FoundPostType = "Found";

    private readonly IPostRepository _postRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetClaimsHandler(
        IPostRepository postRepository,
        IClaimRepository claimRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _claimRepository = claimRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetClaimsResult> Handle(
        GetClaimsQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var post =
            await _postRepository.GetByIdAsync(
                request.PostId,
                cancellationToken);

        if (post is null)
        {
            return new GetClaimsResult(
                GetClaimsOutcome.PostNotFound,
                []);
        }

        if (!string.Equals(
                post.Type,
                FoundPostType,
                StringComparison.OrdinalIgnoreCase))
        {
            return new GetClaimsResult(
                GetClaimsOutcome.NotFoundPostType,
                []);
        }

        // Chỉ chủ bài đăng Found được xem yêu cầu nhận đồ,
        // không để người dùng khác đọc yêu cầu của nhau.
        if (post.UserId != currentUserId)
        {
            return new GetClaimsResult(
                GetClaimsOutcome.NotOwner,
                []);
        }

        var claims =
            await _claimRepository.GetByPostIdAsync(
                post.Id,
                cancellationToken);

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var userById = users.ToDictionary(x => x.Id);

        var result = new List<GetClaimsResponse>();

        foreach (var claim in claims)
        {
            userById.TryGetValue(
                claim.ClaimantUserId,
                out var claimant);

            result.Add(
                new GetClaimsResponse(
                    claim.Id,
                    claim.PostId,
                    claim.ClaimantUserId,
                    claimant?.FullName ?? string.Empty,
                    claim.Status,
                    claim.CreatedAt));
        }

        return new GetClaimsResult(
            GetClaimsOutcome.Success,
            result);
    }
}