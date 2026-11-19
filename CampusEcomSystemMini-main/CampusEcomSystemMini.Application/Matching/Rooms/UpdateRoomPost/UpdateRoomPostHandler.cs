using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Posts;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Rooms.UpdateRoomPost;

public class UpdateRoomPostHandler
    : IRequestHandler<UpdateRoomPostCommand, UpdateRoomPostResult>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateRoomPostHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateRoomPostResult> Handle(
        UpdateRoomPostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var post = await _postRepository.GetByIdAsync(request.Id, cancellationToken);
        if (post is null || post.UserId != userId)
        {
            return new UpdateRoomPostResult(UpdateRoomPostOutcome.NotFoundOrNotOwner, null);
        }

        var type = PostInput.NormalizeType(request.Type) ?? "Room";
        var isLostFound = PostInput.IsLostFoundType(type);
        if (isLostFound && !PostInput.IsValidCoordinate(request.Lat, request.Lng))
        {
            return new UpdateRoomPostResult(UpdateRoomPostOutcome.InvalidCoordinates, null);
        }

        post.Title = request.Title.Trim();
        post.Content = request.Content.Trim();
        post.Type = type;
        post.UpdatedAt = DateTime.UtcNow;

        _postRepository.UpdateAsync(post, cancellationToken);
        await _postRepository.SaveChangesAsync(cancellationToken);

        return new UpdateRoomPostResult(
            UpdateRoomPostOutcome.Updated,
            new UpdateRoomPostResponse(
                post.Id,
                post.UserId,
                post.Title,
                post.Content,
                post.Type,
                post.CreatedAt,
                post.UpdatedAt));
    }
}
