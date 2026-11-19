using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.GetPostLikes;

public record GetPostLikesQuery(
    Guid Id
) : IRequest<List<GetPostLikesResponse>?>;