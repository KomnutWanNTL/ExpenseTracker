// CSV export utilities

import type { Expense } from '../types/expense';
import { formatAmount } from './formatters';

const CATEGORY_LABELS: Record<string, string> = {
  food: 'อาหาร',
  transport: 'เดินทาง',
  shopping: 'ช็อปปิ้ง',
  bills: 'บิล',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  other: 'อื่น ๆ',
};

/**
 * Convert expenses to CSV format
 */
export function expensesToCSV(expenses: Expense[]): string {
  // CSV headers (full fields for import/export roundtrip)
  const headers = ['id', 'date', 'category', 'note', 'amount', 'createdAt'];

  // CSV rows
  const rows = expenses.map((expense) => [
    expense.id,
    expense.date,
    CATEGORY_LABELS[expense.category] || expense.category,
    expense.note,
    expense.amount.toString(),
    expense.createdAt,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma or quote
          const escaped = (cell ?? '').toString().replace(/"/g, '""');
          return escaped.includes(',') || escaped.includes('"') ? `"${escaped}"` : escaped;
        })
        .join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * Download expenses as CSV file
 */
export function downloadExpensesAsCSV(expenses: Expense[]): void {
  const csv = expensesToCSV(expenses);
  
  // Create blob with UTF-8 BOM for proper Thai character encoding
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
