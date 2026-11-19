namespace CampusEcomSystemMini.Application.Auth.Login;

public record LoginResponse(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    string Token
);