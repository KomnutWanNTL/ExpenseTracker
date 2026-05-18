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
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        marginBottom: '12px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.98rem', marginBottom: '2px' }}>
          {expense.note || '(ไม่มีหมายเหตุ)'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          {formatDate(expense.date)} • {CATEGORY_LABELS[expense.category] || expense.category}
        </div>
      </div>
      <div style={{ fontSize: '0.98rem', fontWeight: 600, marginRight: '12px' }}>
        {formatAmount(expense.amount)}
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {onEdit && (
          <button
            onClick={() => onEdit(expense)}
            className="app-btn app-btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.85rem' }}
          >
            แก้ไข
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            className="app-btn app-btn-danger"
            style={{ padding: '4px 8px', fontSize: '0.85rem' }}
          >
            ลบ
          </button>
        )}
      </div>
    </div>
  );
}
