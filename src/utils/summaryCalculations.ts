// Summary calculation utilities

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import type { Expense } from '../types/expense';
import type { Category } from '../types/expense';

export interface CategoryTotal {
  category: Category;
  total: number;
}

export interface DailyTotal {
  date: string;
  total: number;
}

function getMonthPrefix(referenceDate: Date): string {
  return dayjs(referenceDate).tz('Asia/Bangkok').format('YYYY-MM');
}

export function calculateTodayTotal(expenses: Expense[], referenceDate: Date = new Date()): number {
  const today = dayjs(referenceDate).tz('Asia/Bangkok').format('YYYY-MM-DD');
  return expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function calculateMonthlyTotal(expenses: Expense[], referenceDate: Date = new Date()): number {
  const currentMonth = getMonthPrefix(referenceDate);
  return expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function groupCurrentMonthByCategory(
  expenses: Expense[],
  referenceDate: Date = new Date(),
): CategoryTotal[] {
  const currentMonth = getMonthPrefix(referenceDate);
  const totals = new Map<Category, number>();
  for (const expense of expenses) {
    if (!expense.date.startsWith(currentMonth)) continue;
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.category.localeCompare(b.category);
    });
}

export function groupCurrentMonthByDay(
  expenses: Expense[],
  referenceDate: Date = new Date(),
): DailyTotal[] {
  const currentMonth = getMonthPrefix(referenceDate);
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    if (!expense.date.startsWith(currentMonth)) continue;
    totals.set(expense.date, (totals.get(expense.date) ?? 0) + expense.amount);
  }
  return Array.from(totals.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
