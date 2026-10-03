using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Leaderboard;

public class GetLeaderboardHandler
    : IRequestHandler<GetLeaderboardQuery, List<GetLeaderboardResponse>>
{
    // Chưa có quy tắc huy hiệu trong Module 6 nên Badge để trống.
    private const string? NoBadge = null;

    private readonly IUserRepository _userRepository;

    public GetLeaderboardHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<GetLeaderboardResponse>> Handle(
        GetLeaderboardQuery request,
        CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);

        var ordered = LeaderboardRanking.Order(users);

        var result = new List<GetLeaderboardResponse>(
            ordered.Count);

        for (var index = 0; index < ordered.Count; index++)
        {
            result.Add(MapResponse(ordered[index], index + 1));
        }

        return result;
    }

    private static GetLeaderboardResponse MapResponse(
        User user,
        int rank)
    {
        return new GetLeaderboardResponse(
            rank,
            user.Id,
            user.FullName,
            user.AvatarUrl,
            user.ReputationPoints,
            NoBadge);
    }
}
