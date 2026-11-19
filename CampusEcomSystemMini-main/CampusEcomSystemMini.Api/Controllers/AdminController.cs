using CampusEcomSystemMini.Application.Admin.AuditLogs;
using CampusEcomSystemMini.Application.Admin.Dashboard;
using CampusEcomSystemMini.Application.Admin.Posts;
using CampusEcomSystemMini.Application.Admin.Reports;
using CampusEcomSystemMini.Application.Admin.Users;
using CampusEcomSystemMini.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusEcomSystemMini.Api.Controllers;

// MODULE_6 — Admin Hub (Batch 4).
// Mọi API trong controller này đều yêu cầu role Admin,
// frontend có thể ẩn UI nhưng backend vẫn bắt buộc kiểm tra.
[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/admin/dashboard
    [HttpGet("dashboard")]
    public async Task<ActionResult<GetAdminDashboardResponse>> GetDashboard(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAdminDashboardQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/admin/audit-logs
    [HttpGet("audit-logs")]
    public async Task<ActionResult<List<GetAdminAuditLogsResponse>>> GetAuditLogs(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAdminAuditLogsQuery(),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/admin/users?page=&pageSize=&search=&status=
    [HttpGet("users")]
    public async Task<ActionResult<PagedResponse<GetAdminUsersResponse>>> GetUsers(
        [FromQuery] GetAdminUsersQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    // GET /api/admin/users/{id}
    [HttpGet("users/{id:guid}")]
    public async Task<ActionResult<GetAdminUserDetailResponse>> GetUser(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAdminUserDetailQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // PUT /api/admin/users/{id}/status
    // Chỉ đổi Active / Blocked, không đổi Role.
    [HttpPut("users/{id:guid}/status")]
    public async Task<ActionResult<UpdateUserStatusResponse>> UpdateUserStatus(
        Guid id,
        UpdateUserStatusCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        switch (result.Outcome)
        {
            // Người dùng không tồn tại.
            case UpdateUserStatusOutcome.UserNotFound:
                return NotFound();

            // Chỉ nhận Active hoặc Blocked.
            case UpdateUserStatusOutcome.InvalidStatus:
                return BadRequest(
                    "Status must be Active or Blocked.");

            default:
                return Ok(result.Response);
        }
    }

    // POST /api/admin/users/{id}/warning
    [HttpPost("users/{id:guid}/warning")]
    public async Task<ActionResult<IssueWarningResponse>> IssueWarning(
        Guid id,
        IssueWarningCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        return result.Outcome switch
        {
            IssueWarningOutcome.UserNotFound => NotFound(),
            _ => Ok(result.Response),
        };
    }

    // PUT /api/admin/users/{id}/suspend
    [HttpPut("users/{id:guid}/suspend")]
    public async Task<ActionResult<SuspendUserResponse>> SuspendUser(
        Guid id,
        SuspendUserCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        return result.Outcome switch
        {
            SuspendUserOutcome.UserNotFound => NotFound(),
            _ => Ok(result.Response),
        };
    }

    // PUT /api/admin/users/{id}/reactivate
    [HttpPut("users/{id:guid}/reactivate")]
    public async Task<ActionResult<ReactivateUserResponse>> ReactivateUser(
        Guid id,
        ReactivateUserCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        return result.Outcome switch
        {
            ReactivateUserOutcome.UserNotFound => NotFound(),
            _ => Ok(result.Response),
        };
    }

    // GET /api/admin/posts?type=&status=&search=&page=&pageSize=
    [HttpGet("posts")]
    public async Task<ActionResult<PagedResponse<GetAdminPostsResponse>>> GetPosts(
        [FromQuery] GetAdminPostsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    // GET /api/admin/posts/{id}
    [HttpGet("posts/{id:guid}")]
    public async Task<ActionResult<GetAdminPostDetailResponse>> GetPost(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAdminPostDetailQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // DELETE /api/admin/posts/{id}
    [HttpDelete("posts/{id:guid}")]
    public async Task<ActionResult<DeleteAdminPostResponse>> DeletePost(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new DeleteAdminPostCommand(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // PUT /api/admin/posts/{id}/toggle-hidden
    // Đảo ngược IsHidden: ẩn / khôi phục bài đăng.
    // Khi ẩn có thể gửi lý do trong body { "reason": "..." }.
    [HttpPut("posts/{id:guid}/toggle-hidden")]
    public async Task<ActionResult<TogglePostHiddenResponse>> TogglePostHidden(
        Guid id,
        [FromBody] TogglePostHiddenCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            command with { Id = id },
            cancellationToken);

        switch (result.Outcome)
        {
            case TogglePostHiddenOutcome.PostNotFound:
                return NotFound();

            default:
                return Ok(result.Response);
        }
    }

    // GET /api/admin/reports?status=Pending | Approved | Rejected
    [HttpGet("reports")]
    public async Task<ActionResult<List<GetAdminReportsResponse>>> GetReports(
        [FromQuery] GetAdminReportsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    // GET /api/admin/reports/{id}
    [HttpGet("reports/{id:guid}")]
    public async Task<ActionResult<GetAdminReportDetailResponse>> GetReport(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAdminReportDetailQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // PUT /api/admin/reports/{id}/approve
    // Pending → Approved.
    [HttpPut("reports/{id:guid}/approve")]
    public async Task<ActionResult<ApproveReportResponse>> ApproveReport(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new ApproveReportCommand(id),
            cancellationToken);

        switch (result.Outcome)
        {
            case ApproveReportOutcome.ReportNotFound:
                return NotFound();

            // Không xử lý lại report đã Approved / Rejected.
            case ApproveReportOutcome.AlreadyResolved:
                return Conflict(
                    "This report has already been reviewed.");

            default:
                return Ok(result.Response);
        }
    }

    // PUT /api/admin/reports/{id}/reject
    // Pending → Rejected, không trừ điểm.
    [HttpPut("reports/{id:guid}/reject")]
    public async Task<ActionResult<RejectReportResponse>> RejectReport(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new RejectReportCommand(id),
            cancellationToken);

        switch (result.Outcome)
        {
            case RejectReportOutcome.ReportNotFound:
                return NotFound();

            // Không xử lý lại report đã Approved / Rejected.
            case RejectReportOutcome.AlreadyResolved:
                return Conflict(
                    "This report has already been reviewed.");

            default:
                return Ok(result.Response);
        }
    }
}