// Demo Lost & Found Service
import { lostFoundRepository } from "../repositories";
import { delay } from "./authService";

export async function getLostFoundPosts(filter = "") {
  await delay(100);
  return lostFoundRepository.getPosts(filter);
}

export async function getLostFoundMap() {
  await delay(100);
  return lostFoundRepository.getMapPins();
}

export async function createSecretQuestion(postId, { question, answer }) {
  await delay(200);
  return lostFoundRepository.createSecretQuestion(postId, { question, answer });
}

export async function getSecretQuestion(postId) {
  await delay(100);
  return lostFoundRepository.getSecretQuestion(postId);
}

export async function createClaim(postId, { answer }) {
  await delay(200);
  return lostFoundRepository.createClaim(postId, { answer });
}

export async function getClaims(postId) {
  await delay(100);
  return lostFoundRepository.getClaims(postId);
}

export async function approveClaim(claimId) {
  await delay(200);
  return lostFoundRepository.approveClaim(claimId);
}

export async function rejectClaim(claimId) {
  await delay(200);
  return lostFoundRepository.rejectClaim(claimId);
}

export async function markReturned(postId) {
  await delay(200);
  return lostFoundRepository.markReturned(postId);
}

export async function getMatches(postId) {
  await delay(100);
  return lostFoundRepository.getMatches(postId);
}