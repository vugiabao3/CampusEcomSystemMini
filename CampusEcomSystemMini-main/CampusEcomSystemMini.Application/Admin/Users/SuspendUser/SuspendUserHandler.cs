using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

public class SuspendUserHandler
    : IRequestHandler<SuspendUserCommand, SuspendUserResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserService _currentUserService;

    public SuspendUserHandler(
        IUserRepository userRepository,
        IAuditLogRepository auditLogRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _auditLogRepository = auditLogRepository;
        _currentUserService = currentUserService;
    }

    public async Task<SuspendUserResult> Handle(
        SuspendUserCommand request,
        CancellationToken cancellationToken)
    {
        var user =
            await _userRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (user is null)
        {
            return new SuspendUserResult(
                SuspendUserOutcome.UserNotFound,
                null);
        }

        var issuedBy = _currentUserService.UserId;
        var now = DateTime.UtcNow;
        var reason = request.Reason.Trim();

        var oldStatus = user.Status;
        var oldExpiry = user.SuspensionExpiry;

        user.SuspensionReason = reason;
        user.SuspendedBy = issuedBy;
        user.SuspendedAt = now;
        user.SuspensionExpiry = request.SuspendUntilUtc;

        // Có thời hạn và chưa hết hạn => khóa tạm (Suspended).
        // Ngược lại => khóa vĩnh viễn (Blocked).
        var isTemporary =
            request.SuspendUntilUtc.HasValue &&
            request.SuspendUntilUtc.Value > now;

        user.Status = isTemporary
            ? UserStatus.Suspended
            : UserStatus.Blocked;

        user.UpdatedAt = now;

        _userRepository.UpdateAsync(user, cancellationToken);

        await _userRepository.SaveChangesAsync(cancellationToken);

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = issuedBy,
                Action = "SuspendUser",
                EntityType = "User",
                EntityId = user.Id,
                OldValues = $"{{\"status\":\"{oldStatus}\",\"suspensionExpiry\":\"{oldExpiry}\"}}",
                NewValues = $"{{\"status\":\"{user.Status}\",\"suspensionExpiry\":\"{user.SuspensionExpiry}\",\"reason\":\"{reason}\"}}",
                CreatedAt = now,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new SuspendUserResult(
            SuspendUserOutcome.Suspended,
            new SuspendUserResponse(
                user.Id,
                user.Status,
                user.SuspensionExpiry,
                user.SuspensionReason));
    }
}
