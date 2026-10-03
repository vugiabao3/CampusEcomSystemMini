namespace CampusEcomSystemMini.Application.Admin.Posts;

// Bài đăng đã bị Admin xóa.
public record DeleteAdminPostResponse(
    Guid Id,
    string Title,
    bool Deleted
);