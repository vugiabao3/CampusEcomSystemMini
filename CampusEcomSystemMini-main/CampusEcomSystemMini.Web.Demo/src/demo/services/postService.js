// Demo Post Service
import { postRepository } from "../repositories";
import { delay } from "./authService";

export async function getPosts(filters = {}) {
  await delay(100);
  const result = await postRepository.getFeed(filters);
  return result.items || result;
}

export async function getMyPosts() {
  await delay(100);
  return postRepository.getMyPosts("demo-user-1");
}

export async function getLikedPosts() {
  await delay(100);
  return postRepository.getLikedPosts("demo-user-1");
}

export async function getPostById(postId) {
  await delay(100);
  const post = await postRepository.getById(postId);
  if (!post) throw new Error("Không tìm thấy bài đăng.");
  return post;
}

export async function createPost(formData) {
  await delay(200);
  const user = await (await import("../repositories")).userRepository.getById("demo-user-1");
  return postRepository.create({
    ...formData,
    userId: "demo-user-1",
    userName: user.fullName,
    userAvatar: user.avatarUrl,
    university: user.university,
    faculty: user.faculty,
    likesCount: 0,
    likedByMe: false,
    commentsCount: 0,
  });
}

export async function updatePost(postId, formData) {
  await delay(200);
  const post = await postRepository.getById(postId);
  if (!post) throw new Error("Không tìm thấy bài đăng.");
  if (post.userId !== "demo-user-1") throw new Error("Bạn không phải chủ bài đăng.");
  return postRepository.update(postId, formData);
}

export async function deletePost(postId) {
  await delay(200);
  const post = await postRepository.getById(postId);
  if (!post) throw new Error("Không tìm thấy bài đăng.");
  if (post.userId !== "demo-user-1") throw new Error("Bạn không phải chủ bài đăng.");
  return postRepository.delete(postId);
}

export async function likePost(postId) {
  await delay(100);
  return postRepository.likePost(postId, "demo-user-1");
}

export async function unlikePost(postId) {
  await delay(100);
  return postRepository.unlikePost(postId, "demo-user-1");
}

export async function getPostLikes(postId) {
  await delay(100);
  return postRepository.getPostLikes(postId);
}