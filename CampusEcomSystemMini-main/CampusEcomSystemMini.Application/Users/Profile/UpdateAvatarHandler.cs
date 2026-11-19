using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Users.Profile;

public class UpdateAvatarHandler
    : IRequestHandler<UpdateAvatarCommand, UpdateAvatarResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateAvatarHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateAvatarResponse> Handle(
        UpdateAvatarCommand request,
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

        user.AvatarUrl = request.AvatarUrl;
        user.UpdatedAt = DateTime.UtcNow;

        _userRepository.UpdateAsync(
            user,
            cancellationToken);

        await _userRepository.SaveChangesAsync(
            cancellationToken);

        return new UpdateAvatarResponse(
            user.Id,
            user.AvatarUrl);
    }
}
