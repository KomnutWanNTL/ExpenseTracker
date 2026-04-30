// Budget calculation utilities

import type { Expense, Category } from '../types/expense';
import type { Budget, BudgetStatus } from '../types/budget';

export interface BudgetUsage {
  category: Category;
  budgetAmount: number;
  spentAmount: number;
  percentageUsed: number; // 0-100+
  status: BudgetStatus;
}

export interface BudgetSummary {
  budgets: BudgetUsage[];
  totalBudget: number;
  totalSpent: number;
}

/**
 * Get current month date range (YYYY-MM-DD format) in local timezone
 */
function getMonthDateRange(): { start: string; end: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // First day of current month
  const startDate = new Date(year, month, 1);
  const start = startDate.getFullYear() + '-' + 
                String(startDate.getMonth() + 1).padStart(2, '0') + '-' +
                String(startDate.getDate()).padStart(2, '0');
  
  // Last day of current month
  const endDate = new Date(year, month + 1, 0);
  const end = endDate.getFullYear() + '-' + 
              String(endDate.getMonth() + 1).padStart(2, '0') + '-' +
              String(endDate.getDate()).padStart(2, '0');
  
  return { start, end };
}

/**
 * Calculate spending by category for current month
 */
export function calculateSpentByCategory(expenses: Expense[]): Record<Category, number> {
  const { start, end } = getMonthDateRange();
  const spent: Record<string, number> = {};

  expenses.forEach((expense) => {
    const expenseDate = expense.date; // YYYY-MM-DD format
    if (expenseDate >= start && expenseDate <= end) {
      spent[expense.category] = (spent[expense.category] || 0) + expense.amount;
    }
  });

  return spent as Record<Category, number>;
}

/**
 * Classify budget status based on percentage used
 * Normal: < 80%
 * Near limit: 80% to 100%
 * Over budget: > 100%
 */
export function classifyBudgetStatus(percentageUsed: number): BudgetStatus {
  if (percentageUsed > 100) return 'over-budget';
  if (percentageUsed >= 80) return 'near-limit';
  return 'normal';
}

/**
 * Calculate budget usage for all categories
 */
export function calculateBudgetUsage(
  budgets: Budget[],
  expenses: Expense[]
): BudgetUsage[] {
  const spentByCategory = calculateSpentByCategory(expenses);

  return budgets
    .map((budget) => {
      const spentAmount = spentByCategory[budget.category] || 0;
      const percentageUsed = (spentAmount / budget.amount) * 100;

      return {
        category: budget.category,
        budgetAmount: budget.amount,
        spentAmount,
        percentageUsed: Math.round(percentageUsed * 10) / 10, // Round to 1 decimal
        status: classifyBudgetStatus(percentageUsed),
      };
    })
    .sort((a, b) => a.category.localeCompare(b.category)); // Deterministic sort
}

/**
 * Calculate total budget summary
 */
export function calculateBudgetSummary(
  budgets: Budget[],
  expenses: Expense[]
): BudgetSummary {
  const budgetUsages = calculateBudgetUsage(budgets, expenses);
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetUsages.reduce((sum, b) => sum + b.spentAmount, 0);

  return {
    budgets: budgetUsages,
    totalBudget,
    totalSpent,
  };
}
