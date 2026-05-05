// noteCategoryMapping.ts
// Utility for persistent note→category mapping (localStorage)
import type { Category } from '../types/expense';

const NOTE_CATEGORY_KEY = 'noteCategoryMap';

export type NoteCategoryMap = Record<string, Category>;

function loadNoteCategoryMap(): NoteCategoryMap {
  try {
    const raw = localStorage.getItem(NOTE_CATEGORY_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveNoteCategoryMap(map: NoteCategoryMap): void {
  try {
    localStorage.setItem(NOTE_CATEGORY_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function getCategoryForNote(note: string): Category | undefined {
  const map = loadNoteCategoryMap();
  return map[note.trim().toLowerCase()];
}

export function setCategoryForNote(note: string, category: Category): void {
  const map = loadNoteCategoryMap();
  map[note.trim().toLowerCase()] = category;
  saveNoteCategoryMap(map);
}

export function removeCategoryForNote(note: string): void {
  const map = loadNoteCategoryMap();
  delete map[note.trim().toLowerCase()];
  saveNoteCategoryMap(map);
}

export function getAllNoteCategoryMappings(): NoteCategoryMap {
  return loadNoteCategoryMap();
}
