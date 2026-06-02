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
  family: 'ครอบครัว',
  other: 'อื่น ๆ',
};

export default function BudgetStatus({ budgets, expenses }: BudgetStatusProps) {
  const budgetUsages = calculateBudgetUsage(budgets, expenses);

  if (budgetUsages.length === 0) {
    return (
      <div className="budget-empty-state">ยังไม่มีการตั้ง Budget</div>
    );
  }

  return (
    <section className="card-surface budget-section">
      <h3 className="budget-title">สถานะ Budget</h3>
      
      {budgetUsages.map((usage) => {
        const statusColor =
          usage.status === 'over-budget'
            ? '#b91d1d'
            : usage.status === 'near-limit'
              ? '#b25e09'
              : '#1a8754';

        return (
          <div
            key={usage.category}
            className="budget-item"
            style={{ borderLeftColor: statusColor }}
          >
            <div className="budget-item-head">
              <div className="budget-item-category">
                <span
                  className="budget-item-dot"
                  style={{ backgroundColor: CATEGORY_COLORS[usage.category] || '#9ca3af' }}
                />
                {CATEGORY_LABELS[usage.category]}
              </div>
              <div className="budget-item-value">
                {formatAmount(usage.spentAmount)} / {formatAmount(usage.budgetAmount)}
              </div>
            </div>

            <div className="budget-progress-track">
              <div
                className="budget-progress-fill"
                style={{
                  backgroundColor: statusColor,
                  width: `${Math.min(usage.percentageUsed, 100)}%`,
                }}
              />
            </div>

            <div
              className="budget-progress-text"
              style={{ color: statusColor }}
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
