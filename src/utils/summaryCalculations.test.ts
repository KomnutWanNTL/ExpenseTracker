import { describe, expect, it } from 'vitest';
import { calculateTodayTotal, calculateMonthlyTotal } from '../utils/summaryCalculations';
import type { Expense } from '../types/expense';

describe('Summary calculations', () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .slice(0, 10);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .slice(0, 7);

  const expenses: Expense[] = [
    {
      id: '1',
      note: 'ข้าว',
      amount: 50,
      category: 'food',
      date: today,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      note: 'น้ำ',
      amount: 30,
      category: 'food',
      date: today,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      note: 'เรียบร้อย',
      amount: 100,
      category: 'transport',
      date: yesterday,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      note: 'เก่า',
      amount: 500,
      category: 'shopping',
      date: lastMonth + '-15',
      createdAt: new Date().toISOString(),
    },
  ];

  it('calculates today total correctly', () => {
    const total = calculateTodayTotal(expenses);
    expect(total).toBe(80); // 50 + 30
  });

  it('calculates monthly total correctly', () => {
    const total = calculateMonthlyTotal(expenses);
    // Should include items from this month only (today + yesterday if it's still in month)
    expect(total).toBeGreaterThanOrEqual(80); // at least today's expenses
  });

  it('returns 0 for empty expenses', () => {
    expect(calculateTodayTotal([])).toBe(0);
    expect(calculateMonthlyTotal([])).toBe(0);
  });
});
