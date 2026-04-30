import { useState } from 'react';
import { formatAmount } from '../utils/formatters';
import { loadBudgets, saveBudgets } from '../storage/budgetStorage';
import { calculateBudgetUsage } from '../utils/budgetCalculations';
import type { Expense, Category } from '../types/expense';
import type { Budget } from '../types/budget';

const CATEGORIES: Category[] = [
  'food',
  'transport',
  'shopping',
  'bills',
  'entertainment',
  'health',
  'other',
];

const CATEGORY_LABELS: Record<Category, string> = {
  food: 'อาหาร',
  transport: 'เดินทาง',
  shopping: 'ช็อปปิ้ง',
  bills: 'บิล',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  other: 'อื่น ๆ',
};

interface BudgetSettingsProps {
  expenses: Expense[];
  onClose?: () => void;
}

export default function BudgetSettings({ expenses, onClose }: BudgetSettingsProps) {
  const [budgets, setBudgets] = useState<Budget[]>(() => loadBudgets());
  const [editingAmount, setEditingAmount] = useState<Record<Category, string>>(() => {
    const amounts: Record<string, string> = {};
    budgets.forEach((b) => {
      amounts[b.category] = b.amount.toString();
    });
    return amounts as Record<Category, string>;
  });

  const budgetUsages = calculateBudgetUsage(budgets, expenses);

  function handleAmountChange(category: Category, value: string) {
    setEditingAmount((prev) => ({
      ...prev,
      [category]: value,
    }));
  }

  function handleSave() {
    const newBudgets: Budget[] = CATEGORIES.map((category) => {
      const amount = parseFloat(editingAmount[category] || '0');
      return {
        category,
        amount: isNaN(amount) ? 0 : Math.max(0, amount),
      };
    }).filter((b) => b.amount > 0);

    setBudgets(newBudgets);
    saveBudgets(newBudgets);
    onClose?.();
  }

  return (
    <div style={{ padding: '16px 16px 24px 16px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '1.3rem' }}>ตั้งค่า Budget</h2>
      
      <div style={{ marginBottom: '20px' }}>
        {CATEGORIES.map((category) => {
          const usage = budgetUsages.find((u) => u.category === category);
          const inputValue = editingAmount[category] || '';

          return (
            <div
              key={category}
              style={{
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid #eee',
              }}
            >
              <div style={{ marginBottom: '6px', fontWeight: 600, fontSize: '0.95rem' }}>
                {CATEGORY_LABELS[category]}
              </div>

              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={inputValue}
                  onChange={(e) => handleAmountChange(category, e.target.value)}
                  placeholder="0"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                  }}
                />
                <span style={{ fontSize: '0.9rem', color: '#999' }}>บาท/เดือน</span>
              </div>

              {usage && usage.budgetAmount > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  จ่ายไปแล้ว: <strong>{formatAmount(usage.spentAmount)}</strong> (
                  <span
                    style={{
                      color:
                        usage.status === 'over-budget'
                          ? '#ef4444'
                          : usage.status === 'near-limit'
                            ? '#f59e0b'
                            : '#10b981',
                    }}
                  >
                    {usage.percentageUsed}%
                  </span>
                  )
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: '#0369a1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          บันทึก
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: '#f3f4f6',
            color: '#333',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
