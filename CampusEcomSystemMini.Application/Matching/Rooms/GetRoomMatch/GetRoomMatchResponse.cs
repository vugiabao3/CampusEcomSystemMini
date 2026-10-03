namespace CampusEcomSystemMini.Application.Matching.Rooms.GetRoomMatch;

public record GetRoomMatchResponse(
    Guid UserId,
    string FullName,
    string? AvatarUrl,
    decimal MatchScore,
    string? PreferredRentalArea,
    decimal? MonthlyRentalBudget,
    string? RoomPostTitle
);