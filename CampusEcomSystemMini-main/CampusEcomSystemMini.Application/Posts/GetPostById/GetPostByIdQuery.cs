using MediatR;

namespace CampusEcomSystemMini.Application.Posts.GetPostById;

public record GetPostByIdQuery(
    Guid Id
) : IRequest<GetPostByIdResponse?>;