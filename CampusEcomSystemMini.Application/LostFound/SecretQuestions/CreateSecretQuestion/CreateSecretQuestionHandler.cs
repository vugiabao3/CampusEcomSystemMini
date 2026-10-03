using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.SecretQuestions.CreateSecretQuestion;

public class CreateSecretQuestionHandler
    : IRequestHandler<
        CreateSecretQuestionCommand,
        CreateSecretQuestionResult>
{
    // Câu hỏi bí mật chỉ áp dụng cho bài đăng Found.
    private const string FoundPostType = "Found";

    private readonly IPostRepository _postRepository;
    private readonly ISecretQuestionRepository _secretQuestionRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ICurrentUserService _currentUserService;

    public CreateSecretQuestionHandler(
        IPostRepository postRepository,
        ISecretQuestionRepository secretQuestionRepository,
        IPasswordHasher passwordHasher,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _secretQuestionRepository = secretQuestionRepository;
        _passwordHasher = passwordHasher;
        _currentUserService = currentUserService;
    }

    public async Task<CreateSecretQuestionResult> Handle(
        CreateSecretQuestionCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;

        var post =
            await _postRepository.GetByIdAsync(
                request.PostId,
                cancellationToken);

        if (post is null)
        {
            return new CreateSecretQuestionResult(
                CreateSecretQuestionOutcome.PostNotFound,
                null);
        }

        if (!string.Equals(
                post.Type,
                FoundPostType,
                StringComparison.OrdinalIgnoreCase))
        {
            return new CreateSecretQuestionResult(
                CreateSecretQuestionOutcome.NotFoundPostType,
                null);
        }

        // Chỉ chủ bài đăng Found được tạo / sửa câu hỏi bí mật.
        if (post.UserId != currentUserId)
        {
            return new CreateSecretQuestionResult(
                CreateSecretQuestionOutcome.NotOwner,
                null);
        }

        var existingSecretQuestion =
            await _secretQuestionRepository.GetByPostIdAsync(
                post.Id,
                cancellationToken);

        if (existingSecretQuestion is not null)
        {
            return new CreateSecretQuestionResult(
                CreateSecretQuestionOutcome.AlreadyExists,
                null);
        }

        var question = request.Question.Trim();

        var answer = request.Answer.Trim();

        var now = DateTime.UtcNow;

        var secretQuestion = new SecretQuestion
        {
            Id = Guid.NewGuid(),
            PostId = post.Id,
            Question = question,

            // Lưu hash một chiều, không lưu câu trả lời bản rõ.
            SecretAnswerHash = _passwordHasher.Hash(answer),
            CreatedAt = now,
            UpdatedAt = now
        };

        await _secretQuestionRepository.AddAsync(
            secretQuestion,
            cancellationToken);

        await _secretQuestionRepository.SaveChangesAsync(
            cancellationToken);

        return new CreateSecretQuestionResult(
            CreateSecretQuestionOutcome.Created,
            new CreateSecretQuestionResponse(
                secretQuestion.PostId,
                secretQuestion.Question,
                secretQuestion.CreatedAt));
    }
}