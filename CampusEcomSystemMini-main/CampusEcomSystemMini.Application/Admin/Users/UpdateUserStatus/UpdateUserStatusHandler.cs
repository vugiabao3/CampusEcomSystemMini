using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

public class UpdateUserStatusHandler
    : IRequestHandler<
        UpdateUserStatusCommand,
        UpdateUserStatusResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateUserStatusHandler(
        IUserRepository userRepository,
        IAuditLogRepository auditLogRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _auditLogRepository = auditLogRepository;
        _currentUserService = currentUserService;
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

        var oldStatus = user.Status;

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

        _userRepository.UpdateAsync(user, cancellationToken);

        await _userRepository.SaveChangesAsync(cancellationToken);

        var action = string.Equals(
            user.Status,
            UserStatus.Active,
            StringComparison.OrdinalIgnoreCase)
            ? "UnblockUser"
            : "BlockUser";

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = _currentUserService.UserId,
                Action = action,
                EntityType = "User",
                EntityId = user.Id,
                OldValues = $"{{\"status\":\"{oldStatus}\"}}",
                NewValues = $"{{\"status\":\"{user.Status}\"}}",
                CreatedAt = DateTime.UtcNow,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new UpdateUserStatusResult(
            UpdateUserStatusOutcome.Updated,
            new UpdateUserStatusResponse(
                user.Id,
                user.FullName,
                user.Role,
                user.Status));
    }
}
