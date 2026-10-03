// chatHub.js — SignalR client cho /hubs/chat (MODULE_5 / BATCH 3)
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import { getToken } from "../services/authService.js";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5067"
).replace(/\/+$/, "");

// Tạo HubConnection đến /hubs/chat.
// JWT được gửi qua accessTokenFactory
// (query string access_token), server đọc
// JWT trong OnMessageReceived cho path /hubs.
// ReceiveMessage được Server gọi khi có tin nhắn
// mới trong cuộc trò chuyện của người dùng.
export function createChatConnection(onReceiveMessage) {
  const connection = new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/chat`, {
      accessTokenFactory: () => getToken() ?? "",
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();

  connection.on("ReceiveMessage", (message) => {
    onReceiveMessage?.(message);
  });

  return connection;
}
