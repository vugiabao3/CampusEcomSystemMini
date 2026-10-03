using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.Claims.CreateClaim;

public class CreateClaimHandler
    : IRequestHandler<CreateClaimCommand, CreateClaimResult>
{
    // Yêu cầu nhận đồ chỉ áp dụng cho bài đăng Found.
    private const string FoundPostType = "Found";

    // Trạng thái khởi tạo của yêu cầu nhận đồ.
    private const string PendingStatus = "Pending";

    private readonly IPostRepository _postRepository;
    private readonly ISecretQuestionRepository _secretQuestionRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ICurrentUserService _currentUserService;

    public CreateClaimHandler(
        IPostRepository postRepository,
        ISecretQuestionRepository secretQuestionRepository,
        IClaimRepository claimRepository,
        IPasswordHasher passwordHasher,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _secretQuestionRepository = secretQuestionRepository;
        _claimRepository = claimRepository;
        _passwordHasher = passwordHasher;
        _currentUserService = currentUserService;
    }

    public async Task<CreateClaimResult> Handle(
        CreateClaimCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var post =
            await _postRepository.GetByIdAsync(
                request.PostId,
                cancellationToken);

        if (post is null)
        {
            return new CreateClaimResult(
                CreateClaimOutcome.PostNotFound,
                null);
        }

        if (!string.Equals(
                post.Type,
                FoundPostType,
                StringComparison.OrdinalIgnoreCase))
        {
            return new CreateClaimResult(
                CreateClaimOutcome.NotFoundPostType,
                null);
        }

        // Người nhặt đồ không thể tự gửi yêu cầu nhận lại đồ của mình.
        if (post.UserId == currentUserId)
        {
            return new CreateClaimResult(
                CreateClaimOutcome.IsFinder,
                null);
        }

        var secretQuestion =
            await _secretQuestionRepository.GetByPostIdAsync(
                post.Id,
                cancellationToken);

        // Chưa có câu hỏi bí mật thì chưa thể xác minh.
        if (secretQuestion is null)
        {
            return new CreateClaimResult(
                CreateClaimOutcome.NoSecretQuestion,
                null);
        }

        // So khớp câu trả lời với hash đã lưu.
        // Câu trả lời không được ghi log hay trả về.
        var isAnswerValid = _passwordHasher.Verify(
            request.Answer.Trim(),
            secretQuestion.SecretAnswerHash);

        if (!isAnswerValid)
        {
            return new CreateClaimResult(
                CreateClaimOutcome.InvalidAnswer,
                null);
        }

        var now = DateTime.UtcNow;

        var claim = new Claim
        {
            Id = Guid.NewGuid(),
            PostId = post.Id,
            ClaimantUserId = currentUserId,
            Status = PendingStatus,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _claimRepository.AddAsync(claim, cancellationToken);

        await _claimRepository.SaveChangesAsync(cancellationToken);

        return new CreateClaimResult(
            CreateClaimOutcome.Created,
            new CreateClaimResponse(
                claim.Id,
                claim.PostId,
                claim.Status));
    }
}