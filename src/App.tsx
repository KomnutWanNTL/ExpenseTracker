

import './App.css'
import { useState, useRef } from 'react';
import QuickAddExpense from './components/QuickAddExpense';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import EditExpense from './components/EditExpense';
import { parseExpenseInput } from './utils/expenseParser';
import { saveExpenses, loadExpenses } from './storage/expenseStorage';
import type { Expense } from './types/expense';

function App() {
  // State for quick add input

  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const lastSubmit = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDelete(id: string) {
    const filtered = expenses.filter(e => e.id !== id);
    setExpenses(filtered);
    saveExpenses(filtered);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
  }

  function handleSaveEdit(updatedExpense: Expense) {
    const updated = expenses.map(e => (e.id === updatedExpense.id ? updatedExpense : e));
    setExpenses(updated);
    saveExpenses(updated);
    setEditingExpense(null);
  }


  function handleSubmit() {
    if (!input.trim() || isSubmitting) return;
    // Prevent rapid double submit
    const now = Date.now();
    if (now - lastSubmit.current < 500) return;
    lastSubmit.current = now;
    setIsSubmitting(true);
    setError(null);
    const parsed = parseExpenseInput(input);
    if (!parsed.valid || !parsed.amount) {
      setError(parsed.error || 'ข้อมูลไม่ถูกต้อง');
      setIsSubmitting(false);
      return;
    }
    // Create expense object
    const expense: Expense = {
      id: crypto.randomUUID(),
      note: parsed.note,
      amount: parsed.amount,
      category: 'other', // default, will implement auto-category later
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    const newExpenses = [expense, ...expenses];
    saveExpenses(newExpenses);
    setExpenses(newExpenses);
    setInput('');
    setIsSubmitting(false);
    setError(null);
    // Restore focus after save
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  }


  return (
    <main className="container">
      <header>
        <h1>Expense Tracker</h1>
      </header>
      <QuickAddExpense
        value={input}
        onChange={v => {
          setInput(v);
          setError(null);
        }}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
        ref={inputRef}
      />
      {error && (
        <div style={{ color: '#ef4444', marginBottom: 8, fontSize: '0.98rem' }}>{error}</div>
      )}
      <Summary expenses={expenses} />
      <section>
        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
      {editingExpense && (
        <EditExpense
          expense={editingExpense}
          onSave={handleSaveEdit}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </main>
  );
}


export default App
