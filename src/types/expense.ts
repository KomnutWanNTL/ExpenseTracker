// Shared types for Expense Tracker

export type Category =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'other';

export interface Expense {
  id: string;
  note: string;
  amount: number;
  category: Category;
  date: string; // ISO string
}
