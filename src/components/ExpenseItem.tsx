import { formatDate, formatAmount } from '../utils/formatters';
import type { Expense } from '../types/expense';

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
          {formatDate(expense.date)} • {expense.category}
        </div>
      </div>
      <div style={{ fontSize: '0.98rem', fontWeight: 600, marginRight: '12px' }}>
        {formatAmount(expense.amount)}
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {onEdit && (
          <button
            onClick={() => onEdit(expense)}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              backgroundColor: '#e5e7eb',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            แก้ไข
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            ลบ
          </button>
        )}
      </div>
    </div>
  );
}
