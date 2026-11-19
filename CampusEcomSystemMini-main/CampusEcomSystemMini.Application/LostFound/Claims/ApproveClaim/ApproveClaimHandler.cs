using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.ApproveClaim;

public class ApproveClaimHandler
    : IRequestHandler<ApproveClaimCommand, ApproveClaimResult>
{
    private const string FoundPostType = "Found";

    private const string PendingStatus = "Pending";

    private const string ApprovedStatus = "Approved";

    private readonly IPostRepository _postRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly ICurrentUserService _currentUserService;

    public ApproveClaimHandler(
        IPostRepository postRepository,
        IClaimRepository claimRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _claimRepository = claimRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ApproveClaimResult> Handle(
        ApproveClaimCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var claim =
            await _claimRepository.GetByIdAsync(
                request.ClaimId,
                cancellationToken);

        if (claim is null)
        {
            return new ApproveClaimResult(
                ApproveClaimOutcome.ClaimNotFound,
                null);
        }

        var post =
            await _postRepository.GetByIdAsync(
                claim.PostId,
                cancellationToken);

        if (post is null)
        {
            return new ApproveClaimResult(
                ApproveClaimOutcome.PostNotFound,
                null);
        }

        if (!string.Equals(
                post.Type,
                FoundPostType,
                StringComparison.OrdinalIgnoreCase))
        {
            return new ApproveClaimResult(
                ApproveClaimOutcome.NotFoundPostType,
                null);
        }

        // Không để người dùng khác duyệt yêu cầu của người khác.
        if (post.UserId != currentUserId)
        {
            return new ApproveClaimResult(
                ApproveClaimOutcome.NotOwner,
                null);
        }

        // Chỉ yêu cầu đang chờ mới được duyệt.
        if (!string.Equals(
                claim.Status,
                PendingStatus,
                StringComparison.OrdinalIgnoreCase))
        {
            return new ApproveClaimResult(
                ApproveClaimOutcome.NotPending,
                null);
        }

        claim.Status = ApprovedStatus;

        claim.UpdatedAt = DateTime.UtcNow;

        _claimRepository.UpdateAsync(claim, cancellationToken);

        await _claimRepository.SaveChangesAsync(cancellationToken);

        return new ApproveClaimResult(
            ApproveClaimOutcome.Approved,
            new ApproveClaimResponse(
                claim.Id,
                claim.PostId,
                claim.Status));
    }
}