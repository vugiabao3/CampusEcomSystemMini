using MediatR;

namespace CampusEcomSystemMini.Application.Posts.DeletePost;

public record DeletePostCommand(
    Guid Id
) : IRequest<DeletePostResponse?>;