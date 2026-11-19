using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Posts.GetPostById;

public class GetPostByIdHandler
    : IRequestHandler<GetPostByIdQuery, GetPostByIdResponse?>
{
    private readonly IPostRepository _postRepository;

    public GetPostByIdHandler(
        IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<GetPostByIdResponse?> Handle(
        GetPostByIdQuery request,
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

        return new GetPostByIdResponse(
            post.Id,
            post.UserId,
            post.Title,
            post.Content,
            post.Type,
            post.CreatedAt,
            post.UpdatedAt);
    }
}