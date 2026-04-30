// Summary calculation utilities
import type { Expense } from '../types/expense';

export function calculateTodayTotal(expenses: Expense[]): number {
  const today = new Date().toISOString().slice(0, 10);
  return expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function calculateMonthlyTotal(expenses: Expense[]): number {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);
}
