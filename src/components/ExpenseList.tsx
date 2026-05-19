import React from 'react';
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
      <div className="expense-empty-state">ยังไม่มีรายการค่าใช้จ่ายในหน้านี้</div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map(expense => (
        <div key={expense.id}>
          <ExpenseItem
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
