using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Admin.Posts;

public class GetAdminPostDetailHandler
    : IRequestHandler<
        GetAdminPostDetailQuery,
        GetAdminPostDetailResponse?>
{
    private const string ActivePostStatus = "Active";

    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;

    public GetAdminPostDetailHandler(
        IPostRepository postRepository,
        IUserRepository userRepository)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
    }

    public async Task<GetAdminPostDetailResponse?> Handle(
        GetAdminPostDetailQuery request,
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

        var author =
            await _userRepository.GetByIdAsync(
                post.UserId,
                cancellationToken);

        return new GetAdminPostDetailResponse(
            post.Id,
            post.UserId,
            author?.FullName ?? string.Empty,
            post.Type,
            post.Title,
            post.Content,
            ActivePostStatus,
            post.CreatedAt,
            post.UpdatedAt);
    }
}