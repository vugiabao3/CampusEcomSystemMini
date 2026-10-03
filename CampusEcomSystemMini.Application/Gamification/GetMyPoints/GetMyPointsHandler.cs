using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Gamification;

public class GetMyPointsHandler
    : IRequestHandler<GetMyPointsQuery, GetMyPointsResponse?>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetMyPointsHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetMyPointsResponse?> Handle(
        GetMyPointsQuery request,
        CancellationToken cancellationToken)
    {
        // Người dùng lấy từ JWT, không tin frontend.
        var userId = _currentUserService.UserId;

        var user =
            await _userRepository.GetByIdAsync(
                userId,
                cancellationToken);

        if (user is null)
        {
            return null;
        }

        return new GetMyPointsResponse(
            user.Id,
            user.ReputationPoints);
    }
}
