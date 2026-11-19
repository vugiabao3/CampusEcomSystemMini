using System.Net;
using System.Text.Json;
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace CampusEcomSystemMini.Api.Middleware;

// Middleware từ chối yêu cầu của tài khoản bị khóa (Blocked / Suspended).
// Chỉ áp dụng sau khi xác thực, và bỏ qua các ruta auth (/api/auth/*)
// để người dùng bị khóa vẫn có thể đăng nhập / xem thông tin nếu cần.
public class AccountStatusMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AccountStatusMiddleware> _logger;

    public AccountStatusMiddleware(
        RequestDelegate next,
        ILogger<AccountStatusMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(
        HttpContext context,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        // Chỉ kiểm tra đối với request đã xác thực.
        if (context.User?.Identity is { IsAuthenticated: true })
        {
            var path = context.Request.Path.Value ?? string.Empty;

            // Bỏ qua các ruta auth (đăng nhập / đăng ký / đăng xuất).
            if (!path.StartsWith("/api/auth", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    var userId = currentUserService.UserId;

                    var user =
                        await userRepository.GetByIdAsync(
                            userId,
                            CancellationToken.None);

                    if (user is not null && UserStatus.IsLocked(user.Status))
                    {
                        _logger.LogWarning(
                            "Tài khoản {UserId} ({Status}) bị từ chối truy cập {Path}",
                            userId,
                            user.Status,
                            path);

                        context.Response.ContentType = "application/json";
                        context.Response.StatusCode = (int)HttpStatusCode.Forbidden;

                        var response = JsonSerializer.Serialize(new
                        {
                            message = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
                            status = (int)HttpStatusCode.Forbidden
                        });

                        await context.Response.WriteAsync(response);

                        return;
                    }
                }
                catch (UnauthorizedAccessException)
                {
                    // Không lấy được userId → bỏ qua, để middleware authorization xử lý.
                }
            }
        }

        await _next(context);
    }
}

public static class AccountStatusMiddlewareExtensions
{
    public static IApplicationBuilder UseAccountStatus(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AccountStatusMiddleware>();
    }
}
