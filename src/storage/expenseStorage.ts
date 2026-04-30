// Expense storage abstraction for localStorage (MVP)
import type { Expense } from '../types/expense';
import type { ExpenseStoragePayload } from '../types/budget';

const EXPENSES_KEY = 'expenses';

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) return [];
    const parsed: ExpenseStoragePayload = JSON.parse(raw);
    if (!Array.isArray(parsed.expenses)) return [];
    return parsed.expenses;
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  const payload: ExpenseStoragePayload = { expenses };
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(payload));
  } catch {
    // ignore for now (MVP)
  }
}
