using CampusEcomSystemMini.Application.Posts.CreatePost;
using CampusEcomSystemMini.Application.Posts.DeletePost;
using CampusEcomSystemMini.Application.Posts.GetMyPosts;
using CampusEcomSystemMini.Application.Posts.GetPostById;
using CampusEcomSystemMini.Application.Posts.GetPosts;
using CampusEcomSystemMini.Application.Posts.Likes.GetPostLikes;
using CampusEcomSystemMini.Application.Posts.Likes.LikePost;
using CampusEcomSystemMini.Application.Posts.Likes.UnlikePost;
using CampusEcomSystemMini.Application.Posts.UpdatePost;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/posts")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PostsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<GetPostsResponse>>> GetPosts(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetPostsQuery(),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<ActionResult<List<GetMyPostsResponse>>> GetMyPosts(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMyPostsQuery(),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetPostByIdResponse>> GetPostById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetPostByIdQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CreatePostResponse>> CreatePost(
        CreatePostCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command,
            cancellationToken);

        return Created(
            $"/api/posts/{result.Id}",
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdatePostResponse>> UpdatePost(
        Guid id,
        UpdatePostCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeletePostResponse>> DeletePost(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new DeletePostCommand(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost("{id:guid}/like")]
    public async Task<ActionResult<LikePostResponse>> LikePost(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new LikePostCommand(id),
            cancellationToken);

        // Không tồn tại bài đăng hoặc đã thích trước đó.
        if (result is null)
        {
            return Conflict(
                "Post does not exist or is already liked.");
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}/like")]
    public async Task<ActionResult<UnlikePostResponse>> UnlikePost(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new UnlikePostCommand(id),
            cancellationToken);

        // Không có lượt thích của người đang đăng nhập.
        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("{id:guid}/likes")]
    public async Task<ActionResult<List<GetPostLikesResponse>>> GetPostLikes(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetPostLikesQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}