using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

public class GetAdminUserDetailHandler
    : IRequestHandler<
        GetAdminUserDetailQuery,
        GetAdminUserDetailResponse?>
{
    private readonly IUserRepository _userRepository;

    public GetAdminUserDetailHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<GetAdminUserDetailResponse?> Handle(
        GetAdminUserDetailQuery request,
        CancellationToken cancellationToken)
    {
        var user =
            await _userRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (user is null)
        {
            return null;
        }

        return new GetAdminUserDetailResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Phone,
            user.AvatarUrl,
            user.Role,
            user.Status,
            user.ReputationPoints,
            user.CreatedAt);
    }
}