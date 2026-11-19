using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.LikePost;

public record LikePostCommand(
    Guid Id
) : IRequest<LikePostResponse?>;