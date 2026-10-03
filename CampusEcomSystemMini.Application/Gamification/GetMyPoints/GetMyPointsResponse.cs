namespace CampusEcomSystemMini.Application.Gamification;

// Điểm hiện tại của người dùng đang đăng nhập.
public record GetMyPointsResponse(
    Guid UserId,
    int ReputationPoints
);
