// Budget storage abstraction for localStorage (MVP)
import type { Budget } from '../types/budget';
import type { BudgetStoragePayload } from '../types/budget';

const BUDGETS_KEY = 'budgets';

export function loadBudgets(): Budget[] {
  try {
    const raw = localStorage.getItem(BUDGETS_KEY);
    if (!raw) return [];
    const parsed: BudgetStoragePayload = JSON.parse(raw);
    if (!Array.isArray(parsed.budgets)) return [];
    return parsed.budgets;
  } catch {
    return [];
  }
}

export function saveBudgets(budgets: Budget[]): void {
  const payload: BudgetStoragePayload = { budgets };
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(payload));
  } catch {
    // ignore for now (MVP)
  }
}
