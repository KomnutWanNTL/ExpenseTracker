import type { Expense } from '../types/expense';
import ExpenseItem from './ExpenseItem';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          color: '#6b7280',
          fontSize: '0.95rem',
        }}
      >
        ยังไม่มีรายการค่าใช้จ่ายในหน้านี้
      </div>
    );
  }

  return (
    <div>
      {expenses.map(expense => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
