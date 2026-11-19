using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.LostFound.GetLostFoundById;

public class GetLostFoundByIdHandler
    : IRequestHandler<GetLostFoundByIdQuery, GetLostFoundByIdResponse?>
{
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILostFoundRepository _lostFoundRepository;

    public GetLostFoundByIdHandler(
        IPostRepository postRepository,
        IUserRepository userRepository,
        ILostFoundRepository lostFoundRepository)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
        _lostFoundRepository = lostFoundRepository;
    }

    public async Task<GetLostFoundByIdResponse?> Handle(
        GetLostFoundByIdQuery request,
        CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetByIdAsync(
            request.PostId,
            cancellationToken);

        if (post is null)
        {
            return null;
        }

        var record = await _lostFoundRepository.GetByPostIdAsync(
            request.PostId,
            cancellationToken);

        var currentStatus = string.IsNullOrWhiteSpace(record?.Status)
            ? post.Type
            : record.Status;

        var user = await _userRepository.GetByIdAsync(
            post.UserId,
            cancellationToken);

        return new GetLostFoundByIdResponse(
            post.Id,
            post.UserId,
            user?.FullName ?? string.Empty,
            post.Type,
            post.Title,
            post.Content,
            record?.Location,
            record?.Lat,
            record?.Lng,
            currentStatus,
            post.CreatedAt);
    }
}
