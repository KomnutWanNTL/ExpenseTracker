// Shared types for Expense Tracker


// Expense category types (expand as needed)
export type Category =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'other';

// Expense record type
export interface Expense {
  id: string;
  note: string;
  amount: number;
  category: Category;
  date: string; // ISO string (YYYY-MM-DD)
  createdAt: string; // ISO string (timestamp)
}
