// Demo Chat Hub - Simulates SignalR for demo mode
// This replaces the real SignalR connection with a mock implementation

export function createChatConnection(onMessage, onNotification) {
  console.log("[Demo] Chat hub connection created (mock)");
  
  let connected = false;
  let messageHandlers = [];
  let notificationHandlers = [];
  
  if (onMessage) messageHandlers.push(onMessage);
  if (onNotification) notificationHandlers.push(onNotification);
  
  const mockConnection = {
    start: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      connected = true;
      console.log("[Demo] Chat hub connected (mock)");
      return Promise.resolve();
    },
    stop: async () => {
      connected = false;
      console.log("[Demo] Chat hub disconnected (mock)");
      return Promise.resolve();
    },
    invoke: async (method, ...args) => {
      console.log("[Demo] Chat hub invoke:", method, args);
      
      if (method === "SendMessage") {
        const [conversationId, content] = args;
        // Simulate receiving own message back
        setTimeout(() => {
          const mockMessage = {
            conversationId,
            messageId: `msg-${Date.now()}`,
            senderId: "demo-user-1",
            senderName: "Nguyễn Văn An",
            content,
            sentAt: new Date().toISOString(),
          };
          messageHandlers.forEach(h => h(mockMessage));
        }, 100);
      }
      
      return Promise.resolve();
    },
    on: (event, handler) => {
      if (event === "ReceiveMessage") {
        messageHandlers.push(handler);
      } else if (event === "ReceiveNotification") {
        notificationHandlers.push(handler);
      }
    },
    off: (event, handler) => {
      if (event === "ReceiveMessage") {
        messageHandlers = messageHandlers.filter(h => h !== handler);
      } else if (event === "ReceiveNotification") {
        notificationHandlers = notificationHandlers.filter(h => h !== handler);
      }
    },
  };
  
  return mockConnection;
}