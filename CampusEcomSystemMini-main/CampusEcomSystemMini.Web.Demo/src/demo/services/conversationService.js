// Demo Conversation Service
import { conversationRepository } from "../repositories";
import { delay } from "./authService";

export async function getConversations() {
  await delay(100);
  return conversationRepository.getConversations("demo-user-1");
}

export async function getConversation(conversationId) {
  await delay(100);
  return conversationRepository.getConversation(conversationId);
}

export async function getConversationMessages(conversationId) {
  await delay(100);
  return conversationRepository.getConversationMessages(conversationId);
}

export async function markMessagesAsRead(conversationId) {
  await delay(100);
  return conversationRepository.markMessagesAsRead(conversationId, "demo-user-1");
}

export async function sendMessage(conversationId, content) {
  await delay(100);
  return conversationRepository.sendMessage(conversationId, content, "demo-user-1");
}