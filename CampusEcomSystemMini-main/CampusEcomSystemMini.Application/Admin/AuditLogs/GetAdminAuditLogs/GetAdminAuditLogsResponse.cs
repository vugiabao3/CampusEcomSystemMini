namespace CampusEcomSystemMini.Application.Admin.AuditLogs;

// Một dòng trong nhật ký kiểm tra Admin.
public record GetAdminAuditLogsResponse(
    Guid Id,
    Guid ActorId,
    string Action,
    string EntityType,
    Guid EntityId,
    string? OldValues,
    string? NewValues,
    DateTime CreatedAt);
