import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setCategoryForNote, getCategoryForNote, getAllNoteCategoryMappings } from './noteCategoryMapping';
import type { Category } from '../types/expense';

describe('noteCategoryMapping', () => {
  beforeEach(() => {
    // Polyfill localStorage for Vitest (jsdom)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    } else {
      let store: Record<string, string> = {};
      global.localStorage = {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
        key: (i: number) => Object.keys(store)[i] || null,
        length: 0,
      } as any;
      global.localStorage.clear();
    }
  });

  it('saves and retrieves category for note', () => {
    setCategoryForNote('ข้าว', 'food');
    expect(getCategoryForNote('ข้าว')).toBe('food');
    expect(getCategoryForNote(' ข้าว ')).toBe('food');
    expect(getCategoryForNote('กาแฟ')).toBeUndefined();
  });

  it('overwrites category for same note', () => {
    setCategoryForNote('ข้าว', 'food');
    setCategoryForNote('ข้าว', 'shopping');
    expect(getCategoryForNote('ข้าว')).toBe('shopping');
  });

  it('returns all mappings', () => {
    setCategoryForNote('ข้าว', 'food');
    setCategoryForNote('กาแฟ', 'food');
    const map = getAllNoteCategoryMappings();
    expect(map['ข้าว']).toBe('food');
    expect(map['กาแฟ']).toBe('food');
  });
});
