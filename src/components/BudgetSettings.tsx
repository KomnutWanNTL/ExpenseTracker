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
  'family',
  'other',
];

const CATEGORY_LABELS: Record<Category, string> = {
  food: 'อาหาร',
  transport: 'เดินทาง',
  shopping: 'ช็อปปิ้ง',
  bills: 'บิล',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  family: 'ครอบครัว',
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
    <div style={{ padding: '24px 24px 32px 24px' }}>
      <h2
        style={{
          margin: '0 0 24px 0',
          fontSize: '21px',
          fontWeight: 600,
          letterSpacing: '-0.018em',
          color: '#1d1d1f',
        }}
      >
        ตั้งค่า Budget
      </h2>

      <div style={{ marginBottom: '24px' }}>
        {CATEGORIES.map((category) => {
          const usage = budgetUsages.find((u) => u.category === category);
          const inputValue = editingAmount[category] || '';

          return (
            <div
              key={category}
              style={{
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <div
                style={{
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '17px',
                  letterSpacing: '-0.012em',
                  color: '#1d1d1f',
                }}
              >
                {CATEGORY_LABELS[category]}
              </div>

              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={inputValue}
                  onChange={(e) => handleAmountChange(category, e.target.value)}
                  placeholder="0"
                  className="edit-input"
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', letterSpacing: '-0.016em', color: '#7a7a7a' }}>บาท/เดือน</span>
              </div>

              {usage && usage.budgetAmount > 0 && (
                <div style={{ fontSize: '14px', letterSpacing: '-0.016em', color: '#7a7a7a' }}>
                  จ่ายไปแล้ว: <strong style={{ color: '#1d1d1f' }}>{formatAmount(usage.spentAmount)}</strong> (
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        usage.status === 'over-budget'
                          ? '#b91d1d'
                          : usage.status === 'near-limit'
                            ? '#b25e09'
                            : '#1a8754',
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

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onClose}
          className="app-btn app-btn-secondary"
          style={{ flex: 1 }}
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSave}
          className="app-btn app-btn-primary"
          style={{ flex: 1 }}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}
