namespace CampusEcomSystemMini.Application.Auth.Register;

public record RegisterResponse(
    Guid Id,
    string FullName,
    string Email,
    string Role
);