namespace CampusEcomSystemMini.Application.LostFound.SecretQuestions.GetSecretQuestion;

// Chỉ trả về câu hỏi.
// Câu trả lời bí mật không bao giờ được trả về qua API.
public record GetSecretQuestionResponse(
    Guid PostId,
    string Question
);