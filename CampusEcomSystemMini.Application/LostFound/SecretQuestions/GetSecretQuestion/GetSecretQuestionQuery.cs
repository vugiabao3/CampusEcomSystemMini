using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.SecretQuestions.GetSecretQuestion;

// GET /api/lost-found/{postId}/secret-question
// Người bị mất đồ xem câu hỏi để trả lời.
public record GetSecretQuestionQuery(
    Guid PostId
) : IRequest<GetSecretQuestionResponse?>;