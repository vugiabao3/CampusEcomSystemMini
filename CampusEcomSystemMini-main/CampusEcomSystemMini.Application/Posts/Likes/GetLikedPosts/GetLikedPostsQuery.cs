using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.GetLikedPosts;

// GET /api/posts/me/liked
// Danh sách bài đăng mà người dùng hiện tại đã thích.
public record GetLikedPostsQuery() : IRequest<List<GetLikedPostsResponse>>;