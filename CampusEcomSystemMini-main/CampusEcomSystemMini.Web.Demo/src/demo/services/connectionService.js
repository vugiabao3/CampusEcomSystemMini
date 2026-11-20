// Demo Connection Service
import { connectionRepository } from "../repositories";
import { delay } from "./authService";

export async function sendConnectionRequest(receiverId, postId = null) {
  await delay(200);
  return connectionRepository.sendRequest(receiverId, postId);
}

export async function getConnectionRequests() {
  await delay(100);
  return connectionRepository.getRequests("demo-user-1");
}

export async function acceptConnectionRequest(connectionRequestId) {
  await delay(200);
  return connectionRepository.acceptRequest(connectionRequestId);
}

export async function rejectConnectionRequest(connectionRequestId) {
  await delay(200);
  return connectionRepository.rejectRequest(connectionRequestId);
}