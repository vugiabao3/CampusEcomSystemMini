namespace CampusEcomSystemMini.Application.Interfaces;

// Trang bị phân trang dùng chung cho các API danh sách Admin.
public record PagedResponse<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int TotalPages,
    int Page,
    int PageSize);
