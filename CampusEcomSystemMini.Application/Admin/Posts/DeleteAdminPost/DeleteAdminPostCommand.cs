using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

// DELETE /api/admin/posts/{id}
// Admin xóa bài đăng vi phạm. Không xóa User / Auth data.
public record DeleteAdminPostCommand(
    Guid Id
) : IRequest<DeleteAdminPostResponse?>;