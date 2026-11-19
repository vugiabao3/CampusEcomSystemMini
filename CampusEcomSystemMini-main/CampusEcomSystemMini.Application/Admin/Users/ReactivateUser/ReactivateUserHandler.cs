using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

public class ReactivateUserHandler
    : IRequestHandler<ReactivateUserCommand, ReactivateUserResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserService _currentUserService;

    public ReactivateUserHandler(
        IUserRepository userRepository,
        IAuditLogRepository auditLogRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _auditLogRepository = auditLogRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ReactivateUserResult> Handle(
        ReactivateUserCommand request,
        CancellationToken cancellationToken)
    {
        var user =
            await _userRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (user is null)
        {
            return new ReactivateUserResult(
                ReactivateUserOutcome.UserNotFound,
                null);
        }

        // Tài khoản đang hoạt động => không cần khôi phục.
        if (string.Equals(user.Status, UserStatus.Active, System.StringComparison.OrdinalIgnoreCase))
        {
            return new ReactivateUserResult(
                ReactivateUserOutcome.NotLocked,
                new ReactivateUserResponse(user.Id, user.Status));
        }

        var actorId = _currentUserService.UserId;
        var now = DateTime.UtcNow;

        var oldStatus = user.Status;

        user.Status = UserStatus.Active;
        user.SuspensionExpiry = null;
        user.SuspendedBy = null;
        user.SuspensionReason = null;
        user.SuspendedAt = null;
        user.UpdatedAt = now;

        _userRepository.UpdateAsync(user, cancellationToken);

        await _userRepository.SaveChangesAsync(cancellationToken);

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = actorId,
                Action = "ReactivateUser",
                EntityType = "User",
                EntityId = user.Id,
                OldValues = $"{{\"status\":\"{oldStatus}\"}}",
                NewValues = "{\"status\":\"Active\"}",
                CreatedAt = now,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new ReactivateUserResult(
            ReactivateUserOutcome.Reactivated,
            new ReactivateUserResponse(user.Id, user.Status));
    }
}
