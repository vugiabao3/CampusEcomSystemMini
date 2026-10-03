using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

public class UpdateUserStatusHandler
    : IRequestHandler<
        UpdateUserStatusCommand,
        UpdateUserStatusResult>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserStatusHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UpdateUserStatusResult> Handle(
        UpdateUserStatusCommand request,
        CancellationToken cancellationToken)
    {
        var user =
            await _userRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (user is null)
        {
            return new UpdateUserStatusResult(
                UpdateUserStatusOutcome.UserNotFound,
                null);
        }

        // Chỉ nhận Active hoặc Blocked.
        var status = (request.Status ?? string.Empty).Trim();

        if (!UserStatus.IsValid(status))
        {
            return new UpdateUserStatusResult(
                UpdateUserStatusOutcome.InvalidStatus,
                null);
        }

        user.Status = string.Equals(
            status,
            UserStatus.Active,
            StringComparison.OrdinalIgnoreCase)
                ? UserStatus.Active
                : UserStatus.Blocked;

        user.UpdatedAt = DateTime.UtcNow;

        // Role không được đổi qua use case này.
        _userRepository.UpdateAsync(user, cancellationToken);

        await _userRepository.SaveChangesAsync(cancellationToken);

        return new UpdateUserStatusResult(
            UpdateUserStatusOutcome.Updated,
            new UpdateUserStatusResponse(
                user.Id,
                user.FullName,
                user.Role,
                user.Status));
    }
}