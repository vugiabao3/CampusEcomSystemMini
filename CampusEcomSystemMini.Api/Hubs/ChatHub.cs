using System.Collections.Concurrent;
using System.Security.Claims;
using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CampusEcomSystemMini.Api.Hubs;

// SignalR Chat Hub (MODULE_5 / BATCH 3)
// /hubs/chat
// Identity lấy từ Context.User (JWT),
// không tin senderId / userId gửi từ client.
[Authorize]
public class ChatHub : Hub
{
    // Map userId -> các connectionId đang kết nối.
    // Prototype dùng in-memory map, đủ cho 1 server.
    private static readonly ConcurrentDictionary<Guid, HashSet<string>> UserConnections = new();

    private readonly IConversationRepository _conversationRepository;
    private readonly IConversationParticipantRepository _participantRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUserRepository _userRepository;

    public ChatHub(
        IConversationRepository conversationRepository,
        IConversationParticipantRepository participantRepository,
        IMessageRepository messageRepository,
        IUserRepository userRepository)
    {
        _conversationRepository = conversationRepository;
        _participantRepository = participantRepository;
        _messageRepository = messageRepository;
        _userRepository = userRepository;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();

        if (userId.HasValue)
        {
            AddConnection(userId.Value, Context.ConnectionId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(
        Exception? exception)
    {
        var userId = GetUserId();

        if (userId.HasValue)
        {
            RemoveConnection(userId.Value, Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Client gửi tin nhắn: SendMessage(conversationId, content)
    public async Task SendMessage(
        Guid conversationId,
        string content)
    {
        // Identity lấy từ JWT trong Context.User.
        var senderId = GetUserId();

        if (!senderId.HasValue)
        {
            throw new HubException(
                "User ID was not found.");
        }

        var conversation =
            await _conversationRepository.GetByIdAsync(
                conversationId,
                Context.ConnectionAborted);

        if (conversation is null)
        {
            throw new HubException(
                "Conversation does not exist.");
        }

        // Chỉ participant mới được gửi tin nhắn
        // trong cuộc trò chuyện.
        var senderParticipant =
            await _participantRepository.GetByConversationAndUserAsync(
                conversationId,
                senderId.Value,
                Context.ConnectionAborted);

        if (senderParticipant is null)
        {
            throw new HubException(
                "Only conversation participants can send messages.");
        }

        var messageContent = (content ?? string.Empty).Trim();

        if (string.IsNullOrEmpty(messageContent))
        {
            throw new HubException(
                "Message content is required.");
        }

        // Lưu tin nhắn vào DB trước khi broadcast
        // để người nhận offline vẫn xem được history.
        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            SenderId = senderId.Value,
            Content = messageContent,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        await _messageRepository.AddAsync(
            message,
            Context.ConnectionAborted);

        await _messageRepository.SaveChangesAsync(
            Context.ConnectionAborted);

        var sender = await _userRepository.GetByIdAsync(
            senderId.Value,
            Context.ConnectionAborted);

        // DTO broadcast đến các participant.
        var payload = new
        {
            messageId = message.Id,
            conversationId = message.ConversationId,
            senderId = message.SenderId,
            senderName = sender?.FullName ?? string.Empty,
            content = message.Content,
            sentAt = message.SentAt
        };

        // Broadcast đến tất cả connection của
        // các participant trong cuộc trò chuyện.
        var participants =
            await _participantRepository.GetByConversationIdAsync(
                conversationId,
                Context.ConnectionAborted);

        foreach (var participant in participants)
        {
            foreach (var connectionId in GetConnections(participant.UserId))
            {
                await Clients
                    .Client(connectionId)
                    .SendAsync(
                        "ReceiveMessage",
                        payload,
                        Context.ConnectionAborted);
            }
        }
    }

    // Identity lấy từ Claim NameIdentifier của JWT.
    private Guid? GetUserId()
    {
        var userIdClaim =
            Context.User?.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim is null ||
            !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return null;
        }

        return userId;
    }

    private static void AddConnection(
        Guid userId,
        string connectionId)
    {
        UserConnections.AddOrUpdate(
            userId,
            _ =>
            {
                var connections = new HashSet<string>();
                lock (connections)
                {
                    connections.Add(connectionId);
                }

                return connections;
            },
            (_, connections) =>
            {
                lock (connections)
                {
                    connections.Add(connectionId);
                }

                return connections;
            });
    }

    private static void RemoveConnection(
        Guid userId,
        string connectionId)
    {
        if (!UserConnections.TryGetValue(
                userId,
                out var connections))
        {
            return;
        }

        lock (connections)
        {
            connections.Remove(connectionId);

            if (connections.Count > 0)
            {
                return;
            }
        }

        UserConnections.TryRemove(userId, out _);
    }

    private static List<string> GetConnections(
        Guid userId)
    {
        if (!UserConnections.TryGetValue(
                userId,
                out var connections))
        {
            return [];
        }

        lock (connections)
        {
            return [.. connections];
        }
    }
}
