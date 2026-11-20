// Demo Admin Service
import { adminRepository } from "../repositories";
import { delay } from "./authService";

export async function getAdminDashboard() {
  await delay(200);
  return adminRepository.getDashboard();
}

export async function getAdminUsers({ page = 1, pageSize = 10, search = "", status = "" }) {
  await delay(200);
  return adminRepository.getUsers({ page, pageSize, search, status });
}

export async function getAdminUserDetail(userId) {
  await delay(100);
  return adminRepository.getUserDetail(userId);
}

export async function updateAdminUserStatus(userId, status) {
  await delay(200);
  return adminRepository.updateUserStatus(userId, status);
}

export async function issueAdminUserWarning(userId, reason) {
  await delay(200);
  return adminRepository.issueUserWarning(userId, reason);
}

export async function suspendAdminUser(userId, reason, until) {
  await delay(200);
  return adminRepository.suspendUser(userId, reason, until);
}

export async function reactivateAdminUser(userId) {
  await delay(200);
  return adminRepository.reactivateUser(userId);
}

export async function getAdminPosts({ page = 1, pageSize = 10, type = "", status = "", search = "" }) {
  await delay(200);
  return adminRepository.getPosts({ page, pageSize, type, status, search });
}

export async function getAdminPostDetail(postId) {
  await delay(100);
  return adminRepository.getPostDetail(postId);
}

export async function deleteAdminPost(postId) {
  await delay(200);
  return adminRepository.deletePost(postId);
}

export async function toggleAdminPostHidden(postId, reason) {
  await delay(200);
  return adminRepository.togglePostHidden(postId, reason);
}

export async function getAdminReports(status = "") {
  await delay(200);
  return adminRepository.getReports({ status });
}

export async function getAdminReportDetail(reportId) {
  await delay(100);
  return adminRepository.getReportDetail(reportId);
}

export async function approveAdminReport(reportId) {
  await delay(200);
  return adminRepository.approveReport(reportId);
}

export async function rejectAdminReport(reportId) {
  await delay(200);
  return adminRepository.rejectReport(reportId);
}

export async function getAdminAuditLogs() {
  await delay(200);
  return adminRepository.getAuditLogs();
}