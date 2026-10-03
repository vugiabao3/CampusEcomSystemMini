using CampusEcomSystemMini.Application.Gamification;
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Infrastructure.Services;

// GamificationService của Module 6.
// Điểm và lịch sử điểm luôn được ghi cùng nhau nên
// User.ReputationPoints và GamificationPointTransaction
// không thể lệch nhau.
public class GamificationService : IGamificationService
{
    private readonly IUserRepository _userRepository;
    private readonly IGamificationPointTransactionRepository _transactionRepository;

    public GamificationService(
        IUserRepository userRepository,
        IGamificationPointTransactionRepository transactionRepository)
    {
        _userRepository = userRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<int> ApplyRuleAsync(
        Guid userId,
        string reason,
        CancellationToken cancellationToken)
    {
        var user =
            await _userRepository.GetByIdAsync(
                userId,
                cancellationToken);

        if (user is null)
        {
            return 0;
        }

        // Lý do chưa có trong bảng điểm thì không thay đổi gì.
        if (!GamificationPointRules.TryGetPoints(
                reason,
                out var change))
        {
            return user.ReputationPoints;
        }

        var utcNow = DateTime.UtcNow;

        var balance = user.ReputationPoints + change;

        user.ReputationPoints = balance;

        user.UpdatedAt = utcNow;

        _userRepository.UpdateAsync(user, cancellationToken);

        await _transactionRepository.AddAsync(
            new GamificationPointTransaction
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Change = change,
                Reason = GamificationPointRules.Trim(reason),
                Balance = balance,
                CreatedAt = utcNow
            },
            cancellationToken);

        // Cùng một DbContext nên một lần Save là đủ.
        await _userRepository.SaveChangesAsync(cancellationToken);

        return balance;
    }
}