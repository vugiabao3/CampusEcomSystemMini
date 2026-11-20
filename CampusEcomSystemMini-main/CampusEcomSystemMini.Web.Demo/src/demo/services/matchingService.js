// Demo Matching Service
import { matchingRepository } from "../repositories";
import { delay } from "./authService";

export async function getStudentMatches() {
  await delay(100);
  return matchingRepository.getStudentMatches("demo-user-1");
}

export async function getStudentMatch(userId) {
  await delay(100);
  return matchingRepository.getStudentMatch(userId);
}

export async function getRoomMatches() {
  await delay(100);
  return matchingRepository.getRoomMatches("demo-user-1");
}

export async function getRoomMatch(userId) {
  await delay(100);
  return matchingRepository.getRoomMatch(userId);
}

export async function createStudentPost(formData) {
  await delay(200);
  return matchingRepository.createStudentPost(formData);
}

export async function createRoomPost(formData) {
  await delay(200);
  return matchingRepository.createRoomPost(formData);
}