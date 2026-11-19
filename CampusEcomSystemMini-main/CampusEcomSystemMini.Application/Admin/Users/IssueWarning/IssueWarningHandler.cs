using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

public class IssueWarningHandler
    : IRequestHandler<IssueWarningCommand, IssueWarningResult>
{
    private readonly IUserRepository _userRepository;
    private readonly IWarningRepository _warningRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserService _currentUserService;

    public IssueWarningHandler(
        IUserRepository userRepository,
        IWarningRepository warningRepository,
        IAuditLogRepository auditLogRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _warningRepository = warningRepository;
        _auditLogRepository = auditLogRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IssueWarningResult> Handle(
        IssueWarningCommand request,
        CancellationToken cancellationToken)
    {
        var user =
            await _userRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (user is null)
        {
            return new IssueWarningResult(
                IssueWarningOutcome.UserNotFound,
                null);
        }

        var issuedBy = _currentUserService.UserId;

        var warning = new Warning
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            IssuedBy = issuedBy,
            Reason = request.Reason.Trim(),
            IssuedAt = DateTime.UtcNow,
        };

        _warningRepository.AddAsync(warning, cancellationToken);

        await _warningRepository.SaveChangesAsync(cancellationToken);

        await _auditLogRepository.AddAsync(
            new AuditLog
            {
                Id = Guid.NewGuid(),
                ActorId = issuedBy,
                Action = "IssueWarning",
                EntityType = "User",
                EntityId = user.Id,
                OldValues = "{}",
                NewValues = $"{{\"reason\":\"{warning.Reason}\"}}",
                CreatedAt = DateTime.UtcNow,
            },
            cancellationToken);

        await _auditLogRepository.SaveChangesAsync(cancellationToken);

        return new IssueWarningResult(
            IssueWarningOutcome.Issued,
            new IssueWarningResponse(
                warning.Id,
                warning.UserId,
                warning.IssuedBy,
                warning.Reason,
                warning.IssuedAt));
    }
}
