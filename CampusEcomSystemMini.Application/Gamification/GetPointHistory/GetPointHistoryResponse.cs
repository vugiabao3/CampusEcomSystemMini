namespace CampusEcomSystemMini.Application.Gamification;

// Một dòng trong lịch sử điểm.
public record GetPointHistoryResponse(
    Guid Id,
    string Type,
    string Reason,
    int Change,
    int Balance,
    DateTime CreatedAt,
    string Status
);
