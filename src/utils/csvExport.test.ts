// Tests for CSV export utilities
import { describe, it, expect } from 'vitest';
import { expensesToCSV } from './csvExport';
import type { Expense } from '../types/expense';

describe('csvExport', () => {
  describe('expensesToCSV', () => {
    it('returns CSV with headers', () => {
      const expenses: Expense[] = [];
      const csv = expensesToCSV(expenses);
      expect(csv).toContain('id,date,category,note,amount,createdAt');
    });

    it('exports expenses with correct fields', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          amount: 100,
          category: 'food',
          note: 'lunch',
          date: '2026-04-30',
          createdAt: '2026-04-30T10:00:00Z',
        },
      ];
      const csv = expensesToCSV(expenses);
      
      // Check that all fields are present
      expect(csv).toContain('2026-04-30');
      expect(csv).toContain('อาหาร');
      expect(csv).toContain('lunch');
      expect(csv).toContain('100');
      expect(csv).toContain('2026-04-30T10:00:00Z');
    });

    it('escapes notes with commas', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          amount: 100,
          category: 'food',
          note: 'lunch, dinner',
          date: '2026-04-30',
          createdAt: '2026-04-30T10:00:00Z',
        },
      ];
      const csv = expensesToCSV(expenses);
      
      // Note with comma should be quoted
      expect(csv).toContain('"lunch, dinner"');
    });

    it('escapes notes with quotes', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          amount: 100,
          category: 'food',
          note: 'lunch "special"',
          date: '2026-04-30',
          createdAt: '2026-04-30T10:00:00Z',
        },
      ];
      const csv = expensesToCSV(expenses);
      
      // Quote should be escaped and field quoted
      expect(csv).toContain('"lunch ""special"""');
    });

    it('exports multiple expenses', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          amount: 100,
          category: 'food',
          note: 'lunch',
          date: '2026-04-30',
          createdAt: '2026-04-30T10:00:00Z',
        },
        {
          id: '2',
          amount: 50,
          category: 'transport',
          note: 'taxi',
          date: '2026-04-30',
          createdAt: '2026-04-30T10:05:00Z',
        },
      ];
      const csv = expensesToCSV(expenses);
      const lines = csv.split('\n');
      
      // Should have header + 2 data rows
      expect(lines).toHaveLength(3);
      expect(lines[0]).toContain('id,date,category,note,amount,createdAt');
      expect(lines[1]).toContain('2026-04-30');
      expect(lines[2]).toContain('2026-04-30');
    });

    it('translates categories to Thai labels', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          amount: 100,
          category: 'food',
          note: 'lunch',
          date: '2026-04-30',
          createdAt: '2026-04-30T10:00:00Z',
        },
        {
          id: '2',
          amount: 50,
          category: 'transport',
          note: 'taxi',
          date: '2026-04-30',
          createdAt: '2026-04-30T10:05:00Z',
        },
      ];
      const csv = expensesToCSV(expenses);
      
      expect(csv).toContain('อาหาร');
      expect(csv).toContain('เดินทาง');
    });
  });
});
