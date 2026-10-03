using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

public class DeleteAdminPostHandler
    : IRequestHandler<
        DeleteAdminPostCommand,
        DeleteAdminPostResponse?>
{
    private readonly IPostRepository _postRepository;

    public DeleteAdminPostHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<DeleteAdminPostResponse?> Handle(
        DeleteAdminPostCommand request,
        CancellationToken cancellationToken)
    {
        var post =
            await _postRepository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (post is null)
        {
            return null;
        }

        // Xóa Post sẽ cascade Likes, SecretQuestion, Claim,
        // LostFoundRecord và Report của bài đăng đó.
        // User và dữ liệu đăng nhập được giữ nguyên.
        _postRepository.Remove(post);

        await _postRepository.SaveChangesAsync(
            cancellationToken);

        return new DeleteAdminPostResponse(
            post.Id,
            post.Title,
            true);
    }
}