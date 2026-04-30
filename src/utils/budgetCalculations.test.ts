// Tests for budget calculation utilities
import { describe, it, expect } from 'vitest';
import {
  calculateSpentByCategory,
  classifyBudgetStatus,
  calculateBudgetUsage,
  calculateBudgetSummary,
} from './budgetCalculations';
import type { Expense } from '../types/expense';
import type { Budget } from '../types/budget';

describe('budgetCalculations', () => {
  describe('classifyBudgetStatus', () => {
    it('returns "normal" when percentage < 80', () => {
      expect(classifyBudgetStatus(50)).toBe('normal');
      expect(classifyBudgetStatus(79)).toBe('normal');
    });

    it('returns "near-limit" when percentage 80-100', () => {
      expect(classifyBudgetStatus(80)).toBe('near-limit');
      expect(classifyBudgetStatus(90)).toBe('near-limit');
      expect(classifyBudgetStatus(100)).toBe('near-limit');
    });

    it('returns "over-budget" when percentage > 100', () => {
      expect(classifyBudgetStatus(101)).toBe('over-budget');
      expect(classifyBudgetStatus(150)).toBe('over-budget');
    });
  });

  describe('calculateSpentByCategory', () => {
    it('returns empty object when no expenses', () => {
      const result = calculateSpentByCategory([]);
      expect(Object.keys(result).length).toBe(0);
    });

    it('groups expenses by category for current month', () => {
      const today = new Date();
      const currentDate = today.toISOString().slice(0, 10);

      const expenses: Expense[] = [
        {
          id: '1',
          amount: 100,
          category: 'food',
          note: 'lunch',
          date: currentDate,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          amount: 50,
          category: 'food',
          note: 'snack',
          date: currentDate,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          amount: 200,
          category: 'transport',
          note: 'taxi',
          date: currentDate,
          createdAt: new Date().toISOString(),
        },
      ];

      const result = calculateSpentByCategory(expenses);
      expect(result.food).toBe(150);
      expect(result.transport).toBe(200);
    });

    it('ignores expenses outside current month', () => {
      // Create date in previous month
      const today = new Date();
      const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15)
        .toISOString()
        .slice(0, 10);

      const expenses: Expense[] = [
        {
          id: '1',
          amount: 100,
          category: 'food',
          note: 'lunch',
          date: previousMonth,
          createdAt: new Date().toISOString(),
        },
      ];

      const result = calculateSpentByCategory(expenses);
      expect(result.food).toBeUndefined();
    });
  });

  describe('calculateBudgetUsage', () => {
    it('calculates usage percentage correctly', () => {
      const today = new Date().toISOString().slice(0, 10);

      const budgets: Budget[] = [
        { category: 'food', amount: 1000 },
      ];

      const expenses: Expense[] = [
        {
          id: '1',
          amount: 500,
          category: 'food',
          note: 'lunch',
          date: today,
          createdAt: new Date().toISOString(),
        },
      ];

      const result = calculateBudgetUsage(budgets, expenses);
      expect(result).toHaveLength(1);
      expect(result[0].percentageUsed).toBe(50);
      expect(result[0].status).toBe('normal');
    });

    it('calculates over-budget status correctly', () => {
      const today = new Date().toISOString().slice(0, 10);

      const budgets: Budget[] = [
        { category: 'food', amount: 1000 },
      ];

      const expenses: Expense[] = [
        {
          id: '1',
          amount: 1500,
          category: 'food',
          note: 'lunch',
          date: today,
          createdAt: new Date().toISOString(),
        },
      ];

      const result = calculateBudgetUsage(budgets, expenses);
      expect(result[0].percentageUsed).toBe(150);
      expect(result[0].status).toBe('over-budget');
    });
  });

  describe('calculateBudgetSummary', () => {
    it('returns correct totals', () => {
      const today = new Date().toISOString().slice(0, 10);

      const budgets: Budget[] = [
        { category: 'food', amount: 1000 },
        { category: 'transport', amount: 500 },
      ];

      const expenses: Expense[] = [
        {
          id: '1',
          amount: 500,
          category: 'food',
          note: 'lunch',
          date: today,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          amount: 200,
          category: 'transport',
          note: 'taxi',
          date: today,
          createdAt: new Date().toISOString(),
        },
      ];

      const result = calculateBudgetSummary(budgets, expenses);
      expect(result.totalBudget).toBe(1500);
      expect(result.totalSpent).toBe(700);
      expect(result.budgets).toHaveLength(2);
    });
  });
});
