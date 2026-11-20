// Demo Library Service
import { libraryRepository } from "../repositories";
import { delay } from "./authService";

export async function getBooks(filters = {}) {
  await delay(100);
  return libraryRepository.getBooks(filters);
}

export async function getMyBooks() {
  await delay(100);
  return libraryRepository.getMyBooks("demo-user-1");
}

export async function getBookById(id) {
  await delay(100);
  return libraryRepository.getBookById(id);
}

export async function createBook(formData) {
  await delay(200);
  return libraryRepository.createBook(formData);
}

export async function updateBook(id, formData) {
  await delay(200);
  return libraryRepository.updateBook(id, formData);
}

export async function deleteBook(id) {
  await delay(200);
  return libraryRepository.deleteBook(id);
}

export async function getExchangeMatches() {
  await delay(100);
  return libraryRepository.getExchangeMatches("demo-user-1");
}

export async function getDocuments(filters = {}) {
  await delay(100);
  return libraryRepository.getDocuments(filters);
}

export async function getMyDocuments() {
  await delay(100);
  return libraryRepository.getMyDocuments("demo-user-1");
}

export async function getDocumentById(id) {
  await delay(100);
  return libraryRepository.getDocumentById(id);
}

export async function createDocument(formData) {
  await delay(200);
  return libraryRepository.createDocument(formData);
}

export async function updateDocument(id, formData) {
  await delay(200);
  return libraryRepository.updateDocument(id, formData);
}

export async function deleteDocument(id) {
  await delay(200);
  return libraryRepository.deleteDocument(id);
}

export async function downloadDocument(id) {
  await delay(200);
  return libraryRepository.downloadDocument(id);
}

export async function getDocumentReviews(documentId) {
  await delay(100);
  return libraryRepository.getDocumentReviews(documentId);
}

export async function createDocumentReview(documentId, formData) {
  await delay(200);
  return libraryRepository.createDocumentReview(documentId, formData);
}

export async function updateDocumentReview(reviewId, formData) {
  await delay(200);
  return libraryRepository.updateDocumentReview(reviewId, formData);
}

export async function deleteDocumentReview(reviewId) {
  await delay(200);
  return libraryRepository.deleteDocumentReview(reviewId);
}