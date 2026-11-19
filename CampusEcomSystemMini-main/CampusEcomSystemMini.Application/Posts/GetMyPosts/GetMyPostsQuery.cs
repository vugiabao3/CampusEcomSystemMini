using MediatR;

namespace CampusEcomSystemMini.Application.Posts.GetMyPosts;

public record GetMyPostsQuery : IRequest<List<GetMyPostsResponse>>;