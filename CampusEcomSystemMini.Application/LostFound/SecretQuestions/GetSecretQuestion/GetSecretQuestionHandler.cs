using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.SecretQuestions.GetSecretQuestion;

public class GetSecretQuestionHandler
    : IRequestHandler<
        GetSecretQuestionQuery,
        GetSecretQuestionResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly ISecretQuestionRepository _secretQuestionRepository;

    public GetSecretQuestionHandler(
        IPostRepository postRepository,
        ISecretQuestionRepository secretQuestionRepository)
    {
        _postRepository = postRepository;
        _secretQuestionRepository = secretQuestionRepository;
    }

    public async Task<GetSecretQuestionResponse?> Handle(
        GetSecretQuestionQuery request,
        CancellationToken cancellationToken)
    {
        var post =
            await _postRepository.GetByIdAsync(
                request.PostId,
                cancellationToken);

        if (post is null)
        {
            return null;
        }

        var secretQuestion =
            await _secretQuestionRepository.GetByPostIdAsync(
                post.Id,
                cancellationToken);

        // Bài đăng chưa có câu hỏi bí mật.
        if (secretQuestion is null)
        {
            return null;
        }

        // Chỉ trả về câu hỏi, không trả về SecretAnswerHash.
        return new GetSecretQuestionResponse(
            secretQuestion.PostId,
            secretQuestion.Question);
    }
}