using MediatR;

namespace CampusEcomSystemMini.Application.Connections.SendRequest;

// Input chỉ có ReceiverId. Sender lấy từ ICurrentUserService.
// PostId là tuỳ chọn: gửi từ nút "Yêu cầu kết nối" trên một
// bài đăng thì truyền PostId để lưu đúng ngữ cảnh bài đăng.
public record SendRequestCommand(
    Guid ReceiverId,
    Guid? PostId = null
) : IRequest<SendRequestResult>;
