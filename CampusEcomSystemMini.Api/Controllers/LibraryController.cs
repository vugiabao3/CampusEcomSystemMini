using CampusEcomSystemMini.Application.Library.Books.CreateBook;
using CampusEcomSystemMini.Application.Library.Books.DeleteBook;
using CampusEcomSystemMini.Application.Library.Books.GetBookById;
using CampusEcomSystemMini.Application.Library.Books.GetBooks;
using CampusEcomSystemMini.Application.Library.Books.GetExchangeMatches;
using CampusEcomSystemMini.Application.Library.Books.GetMyBooks;
using CampusEcomSystemMini.Application.Library.Books.UpdateBook;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/library/books")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly IMediator _mediator;

    public LibraryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/library/books?search=...&status=...
    [HttpGet]
    public async Task<ActionResult<List<GetBooksResponse>>> GetBooks(
        [FromQuery] GetBooksQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    // GET /api/library/books/me
    [HttpGet("me")]
    public async Task<ActionResult<List<GetMyBooksResponse>>> GetMyBooks(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMyBooksQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/library/books/exchange-matches
    [HttpGet("exchange-matches")]
    public async Task<ActionResult<List<GetExchangeMatchesResponse>>> GetExchangeMatches(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetExchangeMatchesQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/library/books/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetBookByIdResponse>> GetBookById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetBookByIdQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // POST /api/library/books
    [HttpPost]
    public async Task<ActionResult<CreateBookResponse>> CreateBook(
        CreateBookCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command,
            cancellationToken);

        return Created(
            $"/api/library/books/{result.Id}",
            result);
    }

    // PUT /api/library/books/{id}
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UpdateBookResponse>> UpdateBook(
        Guid id,
        UpdateBookCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        switch (result.Outcome)
        {
            // Bài đăng không tồn tại.
            case UpdateBookOutcome.NotFound:
                return NotFound();

            // Không cho sửa bài đăng của người dùng khác.
            case UpdateBookOutcome.NotOwner:
                return Forbid();

            default:
                return Ok(result.Response);
        }
    }

    // DELETE /api/library/books/{id}
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeleteBookResponse>> DeleteBook(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new DeleteBookCommand(id),
            cancellationToken);

        switch (result.Outcome)
        {
            // Bài đăng không tồn tại.
            case DeleteBookOutcome.NotFound:
                return NotFound();

            // Không cho xóa bài đăng của người dùng khác.
            case DeleteBookOutcome.NotOwner:
                return Forbid();

            default:
                return Ok(result.Response);
        }
    }
}
