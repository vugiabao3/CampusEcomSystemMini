using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.DeleteLostFoundPost;

public class DeleteLostFoundPostHandler
    : IRequestHandler<DeleteLostFoundPostCommand, DeleteLostFoundPostResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly ILostFoundRepository _lostFoundRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteLostFoundPostHandler(IPostRepository postRepository, ILostFoundRepository lostFoundRepository, ICurrentUserService currentUserService)
    {
        _postRepository = postRepository;
        _lostFoundRepository = lostFoundRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteLostFoundPostResponse?> Handle(DeleteLostFoundPostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var post = await _postRepository.GetByIdAsync(request.Id, cancellationToken);
        if (post is null || post.UserId != userId) return null;
        _postRepository.Remove(post);
        await _postRepository.SaveChangesAsync(cancellationToken);
        return new DeleteLostFoundPostResponse(true, "LostFound post deleted successfully.");
    }
}
