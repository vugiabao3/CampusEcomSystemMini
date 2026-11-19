using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Enums;
using MediatR;

namespace CampusEcomSystemMini.Application.Auth.Login;

public class LoginHandler
    : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public LoginHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<LoginResponse> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var email = request.Email
            .Trim()
            .ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(
            email,
            cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        var isPasswordValid =
            _passwordHasher.Verify(
                request.Password,
                user.PasswordHash);

        if (!isPasswordValid)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        // Tài khoản bị khóa (Blocked/Suspended) không được đăng nhập.
        if (UserStatus.IsLocked(user.Status))
        {
            throw new UnauthorizedAccessException(
                "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        var token = _jwtTokenService.GenerateToken(
            user.Id,
            user.Email,
            user.Role);

        return new LoginResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            token);
    }
}