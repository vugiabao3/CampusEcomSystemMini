using System.Threading;
using System.Threading.Tasks;
using CampusEcomSystemMini.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace CampusEcomSystemMini.Api.Services;

// Real-time notification broadcaster backed by SignalR ChatHub.
// Uses the hub's in-memory user-connection map to target a specific user.
public class SignalRNotificationBroadcaster : INotificationBroadcaster
{
    private readonly IHubContext<CampusEcomSystemMini.Api.Hubs.ChatHub> _hubContext;

    public SignalRNotificationBroadcaster(
        IHubContext<CampusEcomSystemMini.Api.Hubs.ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task BroadcastAsync(
        Guid userId,
        object payload,
        CancellationToken cancellationToken = default)
    {
        await _hubContext
            .Clients
            .User(userId.ToString())
            .SendAsync("ReceiveNotification", payload, cancellationToken);
    }
}
