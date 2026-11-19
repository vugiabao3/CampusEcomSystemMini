using System.Threading;
using System.Threading.Tasks;

namespace CampusEcomSystemMini.Application.Interfaces;

// Abstraction for real-time notification delivery.
// Implemented in the Api layer where IHubContext<ChatHub> is available,
// keeping Infrastructure free of a direct reference to Api.
public interface INotificationBroadcaster
{
    Task BroadcastAsync(
        Guid userId,
        object payload,
        CancellationToken cancellationToken = default);
}
