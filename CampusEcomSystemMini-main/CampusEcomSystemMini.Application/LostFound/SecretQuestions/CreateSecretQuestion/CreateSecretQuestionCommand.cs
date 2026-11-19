using System.ComponentModel.DataAnnotations;

using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.SecretQuestions.CreateSecretQuestion;

// POST /api/lost-found/{postId}/secret-question
// PostId lấy từ route, frontend không tự gửi userId khác.
// Câu tri lời được hash và không bao giờ trả về.
public record CreateSecretQuestionCommand(
    Guid PostId,
    [Required] string Question,
    [Required] string Answer
) : IRequest<CreateSecretQuestionResult>;