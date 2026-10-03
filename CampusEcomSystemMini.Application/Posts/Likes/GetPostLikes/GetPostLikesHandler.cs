using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.Likes.GetPostLikes;

public class GetPostLikesHandler
    : IRequestHandler<GetPostLikesQuery, List<GetPostLikesResponse>?>
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly IPostRepository _postRepository;

    public GetPostLikesHandler(
        IPostLikeRepository postLikeRepository,
        IPostRepository postRepository)
    {
        _postLikeRepository = postLikeRepository;
        _postRepository = postRepository;
    }

    public async Task<List<GetPostLikesResponse>?> Handle(
        GetPostLikesQuery request,
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

        var postLikes =
            await _postLikeRepository.GetByPostIdAsync(
                post.Id,
                cancellationToken);

        return postLikes
            .Select(postLike => new GetPostLikesResponse(
                postLike.Id,
                postLike.PostId,
                postLike.UserId,
                postLike.CreatedAt))
            .ToList();
    }
}