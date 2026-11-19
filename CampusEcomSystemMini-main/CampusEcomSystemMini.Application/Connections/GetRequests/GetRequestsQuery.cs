using MediatR;

namespace CampusEcomSystemMini.Application.Connections.GetRequests;

// Lấy yêu cầu kết nối của người dùng đang đăng nhập.
public record GetRequestsQuery : IRequest<GetRequestsResult>;
