import { formatDate, formatAmount } from '../utils/formatters';
import type { Expense } from '../types/expense';

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

interface ExpenseItemProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <div className="expense-item">
      <div className="expense-item-top">
        <div className="expense-item-note">
          {expense.note || '(ไม่มีหมายเหตุ)'}
        </div>
        <div className="expense-item-amount">
          {formatAmount(expense.amount)}
        </div>
        {onEdit && (
          <>
            <button
              onClick={() => onEdit(expense)}
              className="app-btn app-btn-secondary expense-item-action-btn"
            >
              แก้ไข
            </button>
          </>
        )}
        {onDelete && (
          <>
            <button
              onClick={() => onDelete(expense.id)}
              className="app-btn app-btn-danger expense-item-action-btn"
            >
              ลบ
            </button>
          </>
        )}
      </div>
      <div className="expense-item-meta-row">
        <span>{formatDate(expense.date)}</span>
        <span className="expense-item-separator" aria-hidden="true">|</span>
        <span>{CATEGORY_LABELS[expense.category] || expense.category}</span>
      </div>
    </div>
  );
}
