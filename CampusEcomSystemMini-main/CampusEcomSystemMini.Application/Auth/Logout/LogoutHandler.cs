using MediatR;

namespace CampusEcomSystemMini.Application.Auth.Logout;

public class LogoutHandler
    : IRequestHandler<LogoutCommand>
{
    public Task Handle(
        LogoutCommand request,
        CancellationToken cancellationToken)
    {
        // JWT đang sử dụng là stateless.
        // Server không lưu session nên không cần xóa dữ liệu DB.

        return Task.CompletedTask;
    }
}

