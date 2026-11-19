using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.DeleteRoomPost;

public class DeleteRoomPostHandler
    : IRequestHandler<DeleteRoomPostCommand, DeleteRoomPostResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteRoomPostHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteRoomPostResponse?> Handle(
        DeleteRoomPostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var post = await _postRepository.GetByIdAsync(request.Id, cancellationToken);
        if (post is null || post.UserId != userId)
        {
            return null;
        }
        _postRepository.Remove(post);
        await _postRepository.SaveChangesAsync(cancellationToken);
        return new DeleteRoomPostResponse(true, "Room post deleted successfully.");
    }
}
