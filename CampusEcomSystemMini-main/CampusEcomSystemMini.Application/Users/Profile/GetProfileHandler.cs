using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Profile;

public class GetProfileHandler
    : IRequestHandler<GetProfileQuery, GetProfileResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetProfileHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<GetProfileResponse> Handle(
        GetProfileQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        var user =
            await _userRepository.GetByIdAsync(
                userId,
                cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "User not found.");
        }

        return new GetProfileResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Phone,
            user.AvatarUrl,
            user.Role);
    }
}
