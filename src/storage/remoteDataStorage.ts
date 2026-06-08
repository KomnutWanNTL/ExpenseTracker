// remoteDataStorage.ts
// Fetch and merge the central data.json hosted on GitHub Pages
import type { Expense } from '../types/expense';
import type { Budget } from '../types/budget';
import type { NoteCategoryMap } from './noteCategoryMapping';

export interface AppData {
  expenses: Expense[];
  budgets: Budget[];
  noteCategoryMap: NoteCategoryMap;
}

export async function fetchRemoteData(): Promise<AppData | null> {
  try {
    const url = import.meta.env.BASE_URL + 'data.json';
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      expenses: Array.isArray(data.expenses) ? data.expenses : [],
      budgets: Array.isArray(data.budgets) ? data.budgets : [],
      noteCategoryMap:
        data.noteCategoryMap !== null &&
        typeof data.noteCategoryMap === 'object' &&
        !Array.isArray(data.noteCategoryMap)
          ? data.noteCategoryMap
          : {},
    };
  } catch {
    return null;
  }
}

export function mergeData(local: AppData, remote: AppData): AppData {
  // Expenses: merge by id, local wins on conflict
  const expenseMap = new Map<string, Expense>();
  for (const e of remote.expenses) expenseMap.set(e.id, e);
  for (const e of local.expenses) expenseMap.set(e.id, e);
  const expenses = Array.from(expenseMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Budgets: use local if non-empty, else fall back to remote
  const budgets = local.budgets.length > 0 ? local.budgets : remote.budgets;

  // noteCategoryMap: merge, local wins on conflict
  const noteCategoryMap: NoteCategoryMap = {
    ...remote.noteCategoryMap,
    ...local.noteCategoryMap,
  };

  return { expenses, budgets, noteCategoryMap };
}
