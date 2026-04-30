import { describe, expect, it } from 'vitest';
import { parseExpenseInput } from '../utils/expenseParser';

describe('parseExpenseInput', () => {
  it('parses note and amount: ข้าว 50', () => {
    const r = parseExpenseInput('ข้าว 50');
    expect(r.valid).toBe(true);
    expect(r.note).toBe('ข้าว');
    expect(r.amount).toBe(50);
  });
  it('uses last number if multiple: ข้าว 20 น้ำ 30', () => {
    const r = parseExpenseInput('ข้าว 20 น้ำ 30');
    expect(r.valid).toBe(true);
    expect(r.note).toBe('ข้าว 20 น้ำ');
    expect(r.amount).toBe(30);
  });
  it('invalid if no number', () => {
    const r = parseExpenseInput('ข้าว');
    expect(r.valid).toBe(false);
    expect(r.amount).toBeNull();
  });
  it('trims whitespace', () => {
    const r = parseExpenseInput('  ข้าว  50  ');
    expect(r.valid).toBe(true);
    expect(r.note).toBe('ข้าว');
    expect(r.amount).toBe(50);
  });
  it('invalid if amount is zero', () => {
    const r = parseExpenseInput('ข้าว 0');
    expect(r.valid).toBe(false);
  });
});
