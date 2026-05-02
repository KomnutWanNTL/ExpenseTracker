
import { describe, expect, it } from 'vitest';
import {
  calculateTodayTotal,
  calculateMonthlyTotal,
  groupCurrentMonthByCategory,
  groupCurrentMonthByDay,
} from '../utils/summaryCalculations';
import type { Expense } from '../types/expense';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

describe('Summary calculations', () => {
  const today = dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD');
  const yesterday = dayjs().tz('Asia/Bangkok').subtract(1, 'day').format('YYYY-MM-DD');
  const lastMonth = dayjs().tz('Asia/Bangkok').subtract(1, 'month').format('YYYY-MM');

  const expenses: Expense[] = [
    {
      id: '1',
      note: 'ข้าว',
      amount: 50,
      category: 'food',
      date: today,
      createdAt: dayjs().tz('Asia/Bangkok').toISOString(),
    },
    {
      id: '2',
      note: 'น้ำ',
      amount: 30,
      category: 'food',
      date: today,
      createdAt: dayjs().tz('Asia/Bangkok').toISOString(),
    },
    {
      id: '3',
      note: 'เรียบร้อย',
      amount: 100,
      category: 'transport',
      date: yesterday,
      createdAt: dayjs().tz('Asia/Bangkok').toISOString(),
    },
    {
      id: '4',
      note: 'เก่า',
      amount: 500,
      category: 'shopping',
      date: lastMonth + '-15',
      createdAt: dayjs().tz('Asia/Bangkok').toISOString(),
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

  it('groups current month totals by category', () => {
    const referenceDate = new Date('2026-04-20T08:00:00.000Z');
    const monthlyExpenses: Expense[] = [
      {
        id: 'a',
        note: 'ข้าว',
        amount: 80,
        category: 'food',
        date: '2026-04-10',
        createdAt: '2026-04-10T08:00:00.000Z',
      },
      {
        id: 'b',
        note: 'รถไฟฟ้า',
        amount: 100,
        category: 'transport',
        date: '2026-04-11',
        createdAt: '2026-04-11T08:00:00.000Z',
      },
      {
        id: 'c',
        note: 'ขนม',
        amount: 20,
        category: 'food',
        date: '2026-04-12',
        createdAt: '2026-04-12T08:00:00.000Z',
      },
      {
        id: 'd',
        note: 'เดือนก่อน',
        amount: 999,
        category: 'shopping',
        date: '2026-03-20',
        createdAt: '2026-03-20T08:00:00.000Z',
      },
    ];

    const result = groupCurrentMonthByCategory(monthlyExpenses, referenceDate);

    expect(result).toEqual([
      { category: 'food', total: 100 },
      { category: 'transport', total: 100 },
    ]);
  });

  it('groups current month totals by day (ascending)', () => {
    const referenceDate = new Date('2026-04-20T08:00:00.000Z');
    const monthlyExpenses: Expense[] = [
      {
        id: 'a',
        note: 'ค่าเดินทาง',
        amount: 40,
        category: 'transport',
        date: '2026-04-01',
        createdAt: '2026-04-01T08:00:00.000Z',
      },
      {
        id: 'b',
        note: 'กาแฟ',
        amount: 60,
        category: 'food',
        date: '2026-04-01',
        createdAt: '2026-04-01T09:00:00.000Z',
      },
      {
        id: 'c',
        note: 'ข้าวเที่ยง',
        amount: 80,
        category: 'food',
        date: '2026-04-03',
        createdAt: '2026-04-03T08:00:00.000Z',
      },
      {
        id: 'd',
        note: 'เดือนหน้า',
        amount: 70,
        category: 'shopping',
        date: '2026-05-01',
        createdAt: '2026-05-01T08:00:00.000Z',
      },
    ];

    const result = groupCurrentMonthByDay(monthlyExpenses, referenceDate);

    expect(result).toEqual([
      { date: '2026-04-01', total: 100 },
      { date: '2026-04-03', total: 80 },
    ]);
  });
});
