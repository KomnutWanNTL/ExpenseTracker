import { beforeEach, describe, expect, it } from 'vitest';
import { loadExpenses, saveExpenses } from './expenseStorage';
import type { Expense } from '../types/expense';

function createMockStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
    clear: () => {
      data.clear();
    },
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    get length() {
      return data.size;
    },
  };
}

describe('expenseStorage', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMockStorage(),
      configurable: true,
      writable: true,
    });
  });

  it('persists manual category override after save and reload', () => {
    const original: Expense = {
      id: '1',
      note: 'ข้าวกลางวัน',
      amount: 80,
      category: 'food',
      date: '2026-04-30',
      createdAt: '2026-04-30T12:00:00.000Z',
    };

    const edited: Expense = {
      ...original,
      category: 'transport',
    };

    saveExpenses([edited]);
    const restored = loadExpenses();

    expect(restored).toHaveLength(1);
    expect(restored[0].category).toBe('transport');
  });
});
