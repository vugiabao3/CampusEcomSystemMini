using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.RejectClaim;

public class RejectClaimHandler
    : IRequestHandler<RejectClaimCommand, RejectClaimResult>
{
    private const string FoundPostType = "Found";

    private const string PendingStatus = "Pending";

    private const string RejectedStatus = "Rejected";

    private readonly IPostRepository _postRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly ICurrentUserService _currentUserService;

    public RejectClaimHandler(
        IPostRepository postRepository,
        IClaimRepository claimRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _claimRepository = claimRepository;
        _currentUserService = currentUserService;
    }

    public async Task<RejectClaimResult> Handle(
        RejectClaimCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var claim =
            await _claimRepository.GetByIdAsync(
                request.ClaimId,
                cancellationToken);

        if (claim is null)
        {
            return new RejectClaimResult(
                RejectClaimOutcome.ClaimNotFound,
                null);
        }

        var post =
            await _postRepository.GetByIdAsync(
                claim.PostId,
                cancellationToken);

        if (post is null)
        {
            return new RejectClaimResult(
                RejectClaimOutcome.PostNotFound,
                null);
        }

        if (!string.Equals(
                post.Type,
                FoundPostType,
                StringComparison.OrdinalIgnoreCase))
        {
            return new RejectClaimResult(
                RejectClaimOutcome.NotFoundPostType,
                null);
        }

        // Không để người dùng khác từ chối yêu cầu của người khác.
        if (post.UserId != currentUserId)
        {
            return new RejectClaimResult(
                RejectClaimOutcome.NotOwner,
                null);
        }

        // Chỉ yêu cầu đang chờ mới bị từ chối.
        if (!string.Equals(
                claim.Status,
                PendingStatus,
                StringComparison.OrdinalIgnoreCase))
        {
            return new RejectClaimResult(
                RejectClaimOutcome.NotPending,
                null);
        }

        claim.Status = RejectedStatus;

        claim.UpdatedAt = DateTime.UtcNow;

        _claimRepository.UpdateAsync(claim, cancellationToken);

        await _claimRepository.SaveChangesAsync(cancellationToken);

        return new RejectClaimResult(
            RejectClaimOutcome.Rejected,
            new RejectClaimResponse(
                claim.Id,
                claim.PostId,
                claim.Status));
    }
}