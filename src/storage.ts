// Storage abstraction for Expense Tracker
// Handles CRUD for expenses using localStorage

import type { Expense } from './types/expense'

const STORAGE_KEY = 'expenses';

export function loadExpenses(): Expense[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function addExpense(expense: Expense): void {
  const expenses = loadExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
}

export function updateExpense(updated: Expense): void {
  const expenses = loadExpenses().map(e => e.id === updated.id ? updated : e);
  saveExpenses(expenses);
}

export function deleteExpense(id: string): void {
  const expenses = loadExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
}
