// adminService.js — gọi API Admin Hub (MODULE_6 / BATCH 4)
import { request } from "./authService.js";

// Dashboard
export async function getAdminDashboard() {
  return request("/api/admin/dashboard", {
    method: "GET",
  });
}

// Users
export async function getAdminUsers(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.pageSize) query.set("pageSize", params.pageSize);
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  return request(`/api/admin/users?${query.toString()}`, {
    method: "GET",
  });
}

export async function getAdminUserDetail(id) {
  return request(`/api/admin/users/${id}`, {
    method: "GET",
  });
}

export async function updateAdminUserStatus(id, status) {
  return request(`/api/admin/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function issueAdminUserWarning(id, reason) {
  return request(`/api/admin/users/${id}/warning`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function suspendAdminUser(id, reason, suspendUntilUtc) {
  return request(`/api/admin/users/${id}/suspend`, {
    method: "PUT",
    body: JSON.stringify({ reason, suspendUntilUtc }),
  });
}

export async function reactivateAdminUser(id) {
  return request(`/api/admin/users/${id}/reactivate`, {
    method: "PUT",
    body: JSON.stringify({}),
  });
}

// Posts
export async function getAdminPosts(params = {}) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", params.page);
  if (params.pageSize) query.set("pageSize", params.pageSize);

  return request(`/api/admin/posts?${query.toString()}`, {
    method: "GET",
  });
}

export async function getAdminPostDetail(id) {
  return request(`/api/admin/posts/${id}`, {
    method: "GET",
  });
}

export async function deleteAdminPost(id) {
  return request(`/api/admin/posts/${id}`, {
    method: "DELETE",
  });
}

export async function toggleAdminPostHidden(id, reason = null) {
  return request(`/api/admin/posts/${id}/toggle-hidden`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
}

// Reports
export async function getAdminReports(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);

  return request(`/api/admin/reports?${query.toString()}`, {
    method: "GET",
  });
}

export async function getAdminReportDetail(id) {
  return request(`/api/admin/reports/${id}`, {
    method: "GET",
  });
}

export async function approveAdminReport(id) {
  return request(`/api/admin/reports/${id}/approve`, {
    method: "PUT",
  });
}

export async function rejectAdminReport(id) {
  return request(`/api/admin/reports/${id}/reject`, {
    method: "PUT",
  });
}

// Audit Logs
export async function getAdminAuditLogs() {
  return request("/api/admin/audit-logs", {
    method: "GET",
  });
}