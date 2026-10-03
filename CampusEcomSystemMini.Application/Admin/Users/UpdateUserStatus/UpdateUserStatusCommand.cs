using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

// PUT /api/admin/users/{id}/status
// Chỉ đổi Active / Blocked, không đổi Role.
public record UpdateUserStatusCommand(
    Guid Id,

    [Required] string Status
) : IRequest<UpdateUserStatusResult>;