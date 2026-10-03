using CampusEcomSystemMini.Application.Library.Books.CreateBook;
using CampusEcomSystemMini.Application.Library.Books.DeleteBook;
using CampusEcomSystemMini.Application.Library.Books.GetBookById;
using CampusEcomSystemMini.Application.Library.Books.GetBooks;
using CampusEcomSystemMini.Application.Library.Books.GetExchangeMatches;
using CampusEcomSystemMini.Application.Library.Books.GetMyBooks;
using CampusEcomSystemMini.Application.Library.Books.UpdateBook;
using CampusEcomSystemMini.Application.Library.Documents;
using CampusEcomSystemMini.Application.Library.Documents.CreateDocument;
using CampusEcomSystemMini.Application.Library.Documents.DeleteDocument;
using CampusEcomSystemMini.Application.Library.Documents.DownloadDocument;
using CampusEcomSystemMini.Application.Library.Documents.GetDocumentById;
using CampusEcomSystemMini.Application.Library.Documents.GetDocuments;
using CampusEcomSystemMini.Application.Library.Documents.GetMyDocuments;
using CampusEcomSystemMini.Application.Library.Documents.UpdateDocument;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

[ApiController]
[Route("api/library")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly IMediator _mediator;

    public LibraryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // =====================================================
    // BOOK EXCHANGE (MODULE 4 / BATCH 1)
    // =====================================================

    // GET /api/library/books?search=...&status=...
    [HttpGet("books")]
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
    [HttpGet("books/me")]
    public async Task<ActionResult<List<GetMyBooksResponse>>> GetMyBooks(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMyBooksQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/library/books/exchange-matches
    [HttpGet("books/exchange-matches")]
    public async Task<ActionResult<List<GetExchangeMatchesResponse>>> GetExchangeMatches(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetExchangeMatchesQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/library/books/{id}
    [HttpGet("books/{id:guid}")]
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
    [HttpPost("books")]
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
    [HttpPut("books/{id:guid}")]
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
    [HttpDelete("books/{id:guid}")]
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

    // =====================================================
    // DOCUMENTS (MODULE 4 / BATCH 2)
    // =====================================================

    // GET /api/library/documents?search=...&subject=...&pricing=...
    [HttpGet("documents")]
    public async Task<ActionResult<List<GetDocumentsResponse>>> GetDocuments(
        [FromQuery] GetDocumentsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    // GET /api/library/documents/me
    [HttpGet("documents/me")]
    public async Task<ActionResult<List<GetMyDocumentsResponse>>> GetMyDocuments(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMyDocumentsQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/library/documents/{id}
    [HttpGet("documents/{id:guid}")]
    public async Task<ActionResult<GetDocumentByIdResponse>> GetDocumentById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetDocumentByIdQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // POST /api/library/documents  (multipart/form-data)
    //
    // File được map sang DocumentUpload ở Controller
    // để Application không phụ thuộc ASP.NET Core.
    [HttpPost("documents")]
    public async Task<ActionResult<CreateDocumentResponse>> CreateDocument(
        [FromForm] CreateDocumentCommand command,
        IFormFile? file,
        CancellationToken cancellationToken)
    {
        var upload = file is null
            ? null
            : new DocumentUpload(
                file.FileName,
                file.Length,
                file.OpenReadStream());

        var result = await _mediator.Send(
            command with { File = upload },
            cancellationToken);

        switch (result.Outcome)
        {
            // Thiếu Pricing hoặc giá điểm không hợp lệ.
            case CreateDocumentOutcome.InvalidInput:
                return BadRequest(result.ErrorMessage);

            // File không hợp lệ về extension, kích thước hoặc nội dung.
            case CreateDocumentOutcome.InvalidFile:
                return BadRequest(result.ErrorMessage);

            default:
                return Created(
                    $"/api/library/documents/{result.Response!.Id}",
                    result.Response);
        }
    }

    // GET /api/library/documents/{id}/download
    //
    // Tải tài liệu theo workflow:
    //   JWT -> Document -> Pricing -> Balance -> Transaction
    //       -> Watermark -> Commit -> Download
    //
    // Endpoint này là nơi duy nhất được phép trả file gốc.
    [HttpGet("documents/{id:guid}/download")]
    public async Task<IActionResult> DownloadDocument(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new DownloadDocumentQuery(id),
            cancellationToken);

        switch (result.Outcome)
        {
            // Tài liệu không tồn tại.
            case DownloadDocumentOutcome.NotFound:
                return NotFound();

            // File gốc không còn trên storage.
            case DownloadDocumentOutcome.FileMissing:
                return NotFound(result.ErrorMessage);

            // Không đủ điểm để mua tài liệu trả phí.
            case DownloadDocumentOutcome.InsufficientPoints:
                return BadRequest(result.ErrorMessage);

            // Hệ thống điểm chưa triển khai nên không mua được tài liệu trả phí.
            case DownloadDocumentOutcome.PointsUnavailable:
                return Conflict(result.ErrorMessage);

            // Watermark thất bại, không trả file và không giữ giao dịch điểm.
            case DownloadDocumentOutcome.WatermarkFailed:
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    result.ErrorMessage);

            // Lỗi giao dịch điểm, không trả file.
            case DownloadDocumentOutcome.PointTransactionFailed:
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    result.ErrorMessage);

            default:
                var response = result.Response!;

                // Trả file đã đóng dấu watermark.
                return File(
                    response.Content,
                    response.ContentType,
                    response.FileName);
        }
    }

    // PUT /api/library/documents/{id}
    //
    // Chỉ sửa metadata, không thay file gốc.
    [HttpPut("documents/{id:guid}")]
    public async Task<ActionResult<UpdateDocumentResponse>> UpdateDocument(
        Guid id,
        UpdateDocumentCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        switch (result.Outcome)
        {
            // Tài liệu không tồn tại.
            case UpdateDocumentOutcome.NotFound:
                return NotFound();

            // Không cho sửa tài liệu của người dùng khác.
            case UpdateDocumentOutcome.NotOwner:
                return Forbid();

            // Tài liệu trả phí phải có giá điểm.
            case UpdateDocumentOutcome.InvalidInput:
                return BadRequest(result.ErrorMessage);

            default:
                return Ok(result.Response);
        }
    }

    // DELETE /api/library/documents/{id}
    [HttpDelete("documents/{id:guid}")]
    public async Task<ActionResult<DeleteDocumentResponse>> DeleteDocument(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new DeleteDocumentCommand(id),
            cancellationToken);

        switch (result.Outcome)
        {
            // Tài liệu không tồn tại.
            case DeleteDocumentOutcome.NotFound:
                return NotFound();

            // Không cho xóa tài liệu của người dùng khác.
            case DeleteDocumentOutcome.NotOwner:
                return Forbid();

            default:
                return Ok(result.Response);
        }
    }
}