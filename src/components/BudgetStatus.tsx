import { formatAmount } from '../utils/formatters';
import { calculateBudgetUsage } from '../utils/budgetCalculations';
import type { Expense } from '../types/expense';
import type { Budget } from '../types/budget';
import { CATEGORY_COLORS } from '../utils/categoryColors';

interface BudgetStatusProps {
  budgets: Budget[];
  expenses: Expense[];
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'อาหาร',
  transport: 'เดินทาง',
  shopping: 'ช็อปปิ้ง',
  bills: 'บิล',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  other: 'อื่น ๆ',
};

export default function BudgetStatus({ budgets, expenses }: BudgetStatusProps) {
  const budgetUsages = calculateBudgetUsage(budgets, expenses);

  if (budgetUsages.length === 0) {
    return (
      <div style={{ padding: '12px 16px', color: '#666', fontSize: '0.9rem' }}>
        ยังไม่มีการตั้ง Budget
      </div>
    );
  }

  return (
    <section style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.05rem', margin: '8px 0 12px 8px', color: '#0369a1' }}>
        สถานะ Budget
      </h3>
      
      {budgetUsages.map((usage) => {
        const statusColor =
          usage.status === 'over-budget'
            ? '#ef4444'
            : usage.status === 'near-limit'
              ? '#f59e0b'
              : '#10b981';

        return (
          <div
            key={usage.category}
            style={{
              marginBottom: '12px',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              borderLeft: `3px solid ${statusColor}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.95rem', gap: 8 }}>
                <span style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: CATEGORY_COLORS[usage.category] || '#9ca3af',
                  border: '1px solid #e5e7eb',
                  marginRight: 2,
                }} />
                {CATEGORY_LABELS[usage.category]}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {formatAmount(usage.spentAmount)} / {formatAmount(usage.budgetAmount)}
              </div>
            </div>

            <div style={{ marginBottom: '4px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: statusColor,
                  width: `${Math.min(usage.percentageUsed, 100)}%`,
                  transition: 'width 0.2s ease',
                }}
              />
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: statusColor,
                fontWeight: 600,
              }}
            >
              {usage.percentageUsed}%{' '}
              {usage.status === 'over-budget' && '(เกิน)'}
              {usage.status === 'near-limit' && '(ใกล้เต็ม)'}
            </div>
          </div>
        );
      })}
    </section>
  );
}
