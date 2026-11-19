using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Application.Posts;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.UpdateStudentPost;

public class UpdateStudentPostHandler
    : IRequestHandler<UpdateStudentPostCommand, UpdateStudentPostResult>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateStudentPostHandler(
        IPostRepository postRepository,
        ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateStudentPostResult> Handle(
        UpdateStudentPostCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var post = await _postRepository.GetByIdAsync(request.Id, cancellationToken);
        if (post is null || post.UserId != userId)
        {
            return new UpdateStudentPostResult(UpdateStudentPostOutcome.NotFoundOrNotOwner, null);
        }
        var type = PostInput.NormalizeType(request.Type) ?? "Student";
        var isLostFound = PostInput.IsLostFoundType(type);
        if (isLostFound && !PostInput.IsValidCoordinate(request.Lat, request.Lng))
        {
            return new UpdateStudentPostResult(UpdateStudentPostOutcome.InvalidCoordinates, null);
        }
        post.Title = request.Title.Trim();
        post.Content = request.Content.Trim();
        post.Type = type;
        post.UpdatedAt = DateTime.UtcNow;
        _postRepository.UpdateAsync(post, cancellationToken);
        await _postRepository.SaveChangesAsync(cancellationToken);
        return new UpdateStudentPostResult(
            UpdateStudentPostOutcome.Updated,
            new UpdateStudentPostResponse(
                post.Id, post.UserId, post.Title, post.Content, post.Type, post.CreatedAt, post.UpdatedAt));
    }
}
