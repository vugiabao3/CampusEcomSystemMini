using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.DeleteLostFoundPost;

public record DeleteLostFoundPostCommand(Guid Id) : IRequest<DeleteLostFoundPostResponse?>;
