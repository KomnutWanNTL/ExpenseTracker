// Budget and status types for Expense Tracker

export interface Budget {
  category: import('./expense').Category;
  amount: number; // monthly budget amount
}

export type BudgetStatus = 'normal' | 'near-limit' | 'over-budget';

// Storage payload types
export interface ExpenseStoragePayload {
  expenses: import('./expense').Expense[];
}

export interface BudgetStoragePayload {
  budgets: Budget[];
}
