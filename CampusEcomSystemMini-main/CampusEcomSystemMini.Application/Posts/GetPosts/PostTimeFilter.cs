namespace CampusEcomSystemMini.Application.Posts.GetPosts;

// Khoảng thời gian hỗ trợ cho GET /api/posts?time=...
// Chỉ "Today" là bộ lọc được hỗ trợ, giá trị khác sẽ bị từ chối 4xx.
public enum PostTimeFilter
{
    Today
}