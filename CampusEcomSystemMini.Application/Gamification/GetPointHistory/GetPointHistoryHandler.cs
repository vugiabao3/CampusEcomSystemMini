using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Gamification;

public class GetPointHistoryHandler
    : IRequestHandler<GetPointHistoryQuery, List<GetPointHistoryResponse>>
{
    // Mỗi giao dịch đã được áp dụng vào Balance ngay khi ghi,
    // nên trạng thái hiển thị luôn là Completed.
    private const string CompletedStatus = "Completed";

    private readonly IGamificationPointTransactionRepository _transactionRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetPointHistoryHandler(
        IGamificationPointTransactionRepository transactionRepository,
        ICurrentUserService currentUserService)
    {
        _transactionRepository = transactionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<GetPointHistoryResponse>> Handle(
        GetPointHistoryQuery request,
        CancellationToken cancellationToken)
    {
        // Chỉ xem được lịch sử điểm của chính mình.
        var userId = _currentUserService.UserId;

        var transactions =
            await _transactionRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        return transactions
            .Select(MapResponse)
            .ToList();
    }

    // Lý do lưu dạng "<Type> <mô tả>", ví dụ "LostFound Returned",
    // nên Type là phần đầu của Reason.
    private static GetPointHistoryResponse MapResponse(
        GamificationPointTransaction transaction)
    {
        return new GetPointHistoryResponse(
            transaction.Id,
            GetType(transaction.Reason),
            transaction.Reason,
            transaction.Change,
            transaction.Balance,
            transaction.CreatedAt,
            CompletedStatus);
    }

    private static string GetType(string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
        {
            return string.Empty;
        }

        var parts = reason.Trim().Split(
            ' ',
            StringSplitOptions.RemoveEmptyEntries);

        return parts.Length > 0
            ? parts[0]
            : string.Empty;
    }
}
