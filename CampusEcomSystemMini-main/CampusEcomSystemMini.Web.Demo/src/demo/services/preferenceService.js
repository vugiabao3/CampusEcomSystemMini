// Demo Preference Service
import { preferencesRepository } from "../repositories";
import { delay } from "./authService";

export async function getPreferences() {
  await delay(100);
  return preferencesRepository.getPreferences();
}

export async function createPreferences(formData) {
  await delay(200);
  return preferencesRepository.createPreferences(formData);
}

export async function updatePreferences(formData) {
  await delay(200);
  return preferencesRepository.updatePreferences(formData);
}

export async function deletePreferences() {
  await delay(200);
  return preferencesRepository.deletePreferences();
}