using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.UnlikePost;

public record UnlikePostCommand(
    Guid Id
) : IRequest<UnlikePostResponse?>;