using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Matching.Students.DeleteStudentPost;

public class DeleteStudentPostHandler
    : IRequestHandler<DeleteStudentPostCommand, DeleteStudentPostResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteStudentPostHandler(IPostRepository postRepository, ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteStudentPostResponse?> Handle(DeleteStudentPostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var post = await _postRepository.GetByIdAsync(request.Id, cancellationToken);
        if (post is null || post.UserId != userId) return null;
        _postRepository.Remove(post);
        await _postRepository.SaveChangesAsync(cancellationToken);
        return new DeleteStudentPostResponse(true, "Student post deleted successfully.");
    }
}
