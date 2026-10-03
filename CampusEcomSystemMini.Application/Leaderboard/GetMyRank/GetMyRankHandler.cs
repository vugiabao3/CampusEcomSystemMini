using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Leaderboard;

public class GetMyRankHandler
    : IRequestHandler<GetMyRankQuery, GetMyRankResponse?>
{
    // Chưa có quy tắc huy hiệu trong Module 6 nên Badge để trống.
    private const string? NoBadge = null;

    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMyRankHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetMyRankResponse?> Handle(
        GetMyRankQuery request,
        CancellationToken cancellationToken)
    {
        var period = LeaderboardRanking.NormalizePeriod(request.Period);

        // Người dùng lấy từ JWT, không tin frontend.
        var currentUserId = _currentUserService.UserId;

        var users = await _userRepository.GetAllAsync(cancellationToken);

        // Dùng chung thứ tự với GetLeaderboard để hai API khớp nhau.
        var ordered = LeaderboardRanking.Order(users);

        var index = ordered.FindIndex(
            x => x.Id == currentUserId);

        if (index < 0)
        {
            return null;
        }

        var user = ordered[index];

        return new GetMyRankResponse(
            index + 1,
            user.ReputationPoints,
            period,
            NoBadge);
    }
}
