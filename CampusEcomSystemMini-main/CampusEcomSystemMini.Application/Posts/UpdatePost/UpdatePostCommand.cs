using System.ComponentModel.DataAnnotations;

using MediatR;

namespace CampusEcomSystemMini.Application.Posts.UpdatePost;

public record UpdatePostCommand(
    [Required] string Title,
    [Required] string Content,
    string? Type,

    // MODULE_3 — Lost & Found: vị trí nơi đồ thất lạc được báo.
    // Chỉ dùng khi Type là Lost hoặc Found, đều là tuỳ chọn.
    string? Location = null,
    double? Lat = null,
    double? Lng = null
) : IRequest<UpdatePostResult>
{
    // Id lấy từ route, không nhận từ body.
    public Guid Id { get; init; }
}