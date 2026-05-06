import type { Expense, Category } from '../types/expense';
import dayjs from 'dayjs';

export function groupTodayByCategory(
  expenses: Expense[],
  referenceDate: string = dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD'),
): { category: Category; total: number }[] {
  const totals = new Map<Category, number>();
  for (const expense of expenses) {
    if (expense.date !== referenceDate) continue;
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.category.localeCompare(b.category);
    });
}
