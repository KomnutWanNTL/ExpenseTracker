import { describe, expect, it } from 'vitest';
import { detectCategoryFromNote } from './categoryDetection';

describe('detectCategoryFromNote', () => {
  it('returns food for known food keyword', () => {
    expect(detectCategoryFromNote('ข้าวผัดหมู')).toBe('food');
  });

  it('returns transport for known transport keyword', () => {
    expect(detectCategoryFromNote('BTS ไปทำงาน')).toBe('transport');
  });

  it('returns other when no keyword matches', () => {
    expect(detectCategoryFromNote('ของฝากให้เพื่อน')).toBe('other');
  });

  it('returns other for empty note', () => {
    expect(detectCategoryFromNote('   ')).toBe('other');
  });
});
