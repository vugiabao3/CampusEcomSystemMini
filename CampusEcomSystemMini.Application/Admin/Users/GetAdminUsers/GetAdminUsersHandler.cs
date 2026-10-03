using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Users;

public class GetAdminUsersHandler
    : IRequestHandler<
        GetAdminUsersQuery,
        List<GetAdminUsersResponse>>
{
    private const int DefaultPageSize = 20;

    private const int MaxPageSize = 200;

    private readonly IUserRepository _userRepository;

    public GetAdminUsersHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<GetAdminUsersResponse>> Handle(
        GetAdminUsersQuery request,
        CancellationToken cancellationToken)
    {
        var users =
            await _userRepository.GetAllAsync(cancellationToken);

        IEnumerable<User> query = users;

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();

            query = query.Where(
                x => (x.FullName ?? string.Empty)
                        .Contains(
                            search,
                            StringComparison.OrdinalIgnoreCase)
                    || (x.Email ?? string.Empty)
                        .Contains(
                            search,
                            StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var status = request.Status.Trim();

            query = query.Where(
                x => string.Equals(
                    x.Status,
                    status,
                    StringComparison.OrdinalIgnoreCase));
        }

        var page = request.Page.HasValue && request.Page.Value > 0
            ? request.Page.Value
            : 1;

        var pageSize =
            request.PageSize.HasValue && request.PageSize.Value > 0
                ? Math.Min(request.PageSize.Value, MaxPageSize)
                : DefaultPageSize;

        // Mới nhất lên đầu, giống danh sách Post và Report.
        var ordered = query
            .OrderByDescending(x => x.CreatedAt)
            .ThenBy(x => x.Id)
            .ToList();

        return ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new GetAdminUsersResponse(
                x.Id,
                x.FullName,
                x.Email,
                x.Role,
                x.Status,
                x.CreatedAt,
                x.ReputationPoints))
            .ToList();
    }
}