namespace CampusEcomSystemMini.Application.LostFound.SecretQuestions.CreateSecretQuestion;

// Phản hồi an toàn cho API tạo câu hỏi bí mật.
// Không có trường nào chứa câu trả lời bí mật.
public record CreateSecretQuestionResponse(
    Guid PostId,
    string Question,
    DateTime CreatedAt
);

// Kết quả xử lý tạo câu hỏi bí mật.
// Handler kiểm tra dữ liệu, Controller ánh xạ sang HTTP status.
public enum CreateSecretQuestionOutcome
{
    Created,
    PostNotFound,
    NotFoundPostType,
    NotOwner,
    AlreadyExists
}

public record CreateSecretQuestionResult(
    CreateSecretQuestionOutcome Outcome,
    CreateSecretQuestionResponse? Response);