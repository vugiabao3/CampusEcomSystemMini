using CampusEcomSystemMini.Application.Gamification;
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Returned;

public class MarkReturnedHandler
    : IRequestHandler<MarkReturnedCommand, MarkReturnedResult>
{
    private const string FoundPostType = "Found";

    private const string ApprovedStatus = "Approved";

    private const string ReturnedStatus = "Returned";

    private readonly IPostRepository _postRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly ILostFoundRepository _lostFoundRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IGamificationService _gamificationService;

    public MarkReturnedHandler(
        IPostRepository postRepository,
        IClaimRepository claimRepository,
        ILostFoundRepository lostFoundRepository,
        ICurrentUserService currentUserService,
        IGamificationService gamificationService)
    {
        _postRepository = postRepository;
        _claimRepository = claimRepository;
        _lostFoundRepository = lostFoundRepository;
        _currentUserService = currentUserService;
        _gamificationService = gamificationService;
    }

    public async Task<MarkReturnedResult> Handle(
        MarkReturnedCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var post = await _postRepository.GetByIdAsync(
            request.PostId,
            cancellationToken);

        if (post is null)
        {
            return new MarkReturnedResult(
                MarkReturnedOutcome.PostNotFound,
                null);
        }

        // Chỉ bài đăng Found mới có thể xác nhận đã trả đồ.
        if (!string.Equals(
                post.Type,
                FoundPostType,
                StringComparison.OrdinalIgnoreCase))
        {
            return new MarkReturnedResult(
                MarkReturnedOutcome.NotFoundPostType,
                null);
        }

        // Không để người dùng khác xác nhận trả đồ thay chủ bài đăng.
        if (post.UserId != currentUserId)
        {
            return new MarkReturnedResult(
                MarkReturnedOutcome.NotOwner,
                null);
        }

        // Chỉ được trả đồ khi đã có yêu cầu nhận đồ được duyệt.
        var claims = await _claimRepository.GetByPostIdAsync(
            request.PostId,
            cancellationToken);

        var hasApprovedClaim = claims.Any(
            x => string.Equals(
                x.Status,
                ApprovedStatus,
                StringComparison.OrdinalIgnoreCase));

        if (!hasApprovedClaim)
        {
            return new MarkReturnedResult(
                MarkReturnedOutcome.NoApprovedClaim,
                null);
        }

        var utcNow = DateTime.UtcNow;

        // Trạng thái Returned nằm trên bản ghi Lost & Found.
        // Bài đăng chưa có bản ghi thì tạo mới để lưu trạng thái.
        var record = await _lostFoundRepository.GetByPostIdAsync(
            request.PostId,
            cancellationToken);

        // Đồ đã được trao trả thì không xác nhận lại lần nữa.
        if (record is not null &&
            string.Equals(
                record.Status,
                ReturnedStatus,
                StringComparison.OrdinalIgnoreCase))
        {
            return new MarkReturnedResult(
                MarkReturnedOutcome.AlreadyReturned,
                null);
        }

        if (record is null)
        {
            record = new LostFoundRecord
            {
                Id = Guid.NewGuid(),
                PostId = post.Id,
                Status = ReturnedStatus,
                CreatedAt = utcNow,
                UpdatedAt = utcNow
            };

            await _lostFoundRepository.AddAsync(
                record,
                cancellationToken);
        }
        else
        {
            record.Status = ReturnedStatus;

            record.UpdatedAt = utcNow;

            _lostFoundRepository.UpdateAsync(
                record,
                cancellationToken);
        }

        await _lostFoundRepository.SaveChangesAsync(cancellationToken);

        // Module 6 Integration: người nhặt đồ trả đồ thành công
        // được thưởng điểm, ghi qua GamificationService.
        // Handler này chỉ thành công một lần cho mỗi bài đăng
        // nên không thể thưởng trùng.
        await _gamificationService.ApplyRuleAsync(
            post.UserId,
            GamificationPointRules.LostFoundReturnedReason,
            cancellationToken);

        return new MarkReturnedResult(
            MarkReturnedOutcome.Returned,
            new MarkReturnedResponse(
                post.Id,
                ReturnedStatus));
    }
}
