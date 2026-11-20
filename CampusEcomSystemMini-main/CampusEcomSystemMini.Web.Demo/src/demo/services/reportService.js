// Demo Report Service
import { reportRepository } from "../repositories";
import { delay } from "./authService";

export async function createReport(postId, reason, description) {
  await delay(200);
  return reportRepository.createReport(postId, reason, description);
}

export async function getMyReports() {
  await delay(100);
  return reportRepository.getMyReports("demo-user-1");
}

// Admin report methods
export async function getAdminReports(status = "") {
  await delay(100);
  return reportRepository.getAllReports(status);
}

export async function getAdminReportDetail(reportId) {
  await delay(100);
  return reportRepository.getReportDetail(reportId);
}

export async function approveAdminReport(reportId) {
  await delay(200);
  return reportRepository.approveReport(reportId);
}

export async function rejectAdminReport(reportId) {
  await delay(200);
  return reportRepository.rejectReport(reportId);
}