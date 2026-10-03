using CampusEcomSystemMini.Application.Gamification;
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Auth.Register;

public class RegisterHandler
    : IRequestHandler<RegisterCommand, RegisterResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IGamificationService _gamificationService;

    public RegisterHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IGamificationService gamificationService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _gamificationService = gamificationService;
    }

    public async Task<RegisterResponse> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser =
            await _userRepository.GetByEmailAsync(
                email,
                cancellationToken);

        if (existingUser is not null)
        {
            throw new InvalidOperationException(
                "Email already exists.");
        }

        var passwordHash =
            _passwordHasher.Hash(request.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = passwordHash,
            Role = "User",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(
            user,
            cancellationToken);

        await _userRepository.SaveChangesAsync(
            cancellationToken);

        // Module 6 Integration: đăng ký nhận điểm khởi đầu.
        // Điểm và lịch sử điểm ghi qua GamificationService.
        await _gamificationService.ApplyRuleAsync(
            user.Id,
            GamificationPointRules.RegisterReason,
            cancellationToken);

        return new RegisterResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Role);
    }
}