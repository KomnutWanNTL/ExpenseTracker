

import './App.css'
import { useState, useRef } from 'react';
import QuickAddExpense from './components/QuickAddExpense';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import EditExpense from './components/EditExpense';
import BudgetSettings from './components/BudgetSettings';
import BudgetStatus from './components/BudgetStatus';

import { parseExpenseInput } from './utils/expenseParser';
import { detectCategoryFromNote } from './utils/categoryDetection';
import { saveExpenses, loadExpenses } from './storage/expenseStorage';
import { loadBudgets } from './storage/budgetStorage';
import { downloadExpensesAsCSV } from './utils/csvExport';
import type { Expense } from './types/expense';

// Always use Thailand local date (YYYY-MM-DD)
function getLocalDateString(): string {
  const now = new Date();
  // Convert to Asia/Bangkok timezone (UTC+7)
  const tzOffset = -420; // minutes
  const local = new Date(now.getTime() - (now.getTimezoneOffset() - tzOffset) * 60000);
  return local.toISOString().slice(0, 10);
}

function App() {
  // State for quick add input

  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [budgets, setBudgets] = useState(() => loadBudgets());
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
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
    // Ensure edited date is also local date string if changed
    const fixedExpense = {
      ...updatedExpense,
      date: updatedExpense.date ? updatedExpense.date : getLocalDateString(),
    };
    const updated = expenses.map(e => (e.id === updatedExpense.id ? fixedExpense : e));
    setExpenses(updated);
    saveExpenses(updated);
    setEditingExpense(null);
  }

  function handleCloseBudgetSettings() {
    setBudgets(loadBudgets());
    setShowBudgetSettings(false);
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
      category: detectCategoryFromNote(parsed.note),
      date: getLocalDateString(),
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
    <main className="container" style={{ marginTop: '10px' }}>
      <header className="app-header-row">
        <h1 className="app-title">Expense Tracker</h1>
        <div className="header-btn-group">
          <button
            className="header-btn export-btn"
            onClick={() => downloadExpensesAsCSV(expenses)}
          >
            Export
          </button>
          <button
            className="header-btn budget-btn"
            onClick={() => setShowBudgetSettings(true)}
          >
            Budget
          </button>
        </div>
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
        <div style={{ color: '#ef4444', fontSize: '0.98rem', padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{error}</div>
      )}
      <Summary expenses={expenses} />
      {budgets.length > 0 && <BudgetStatus budgets={budgets} expenses={expenses} />}
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
      {showBudgetSettings && (
        <div style={bottomDrawerStyle}>
          <div style={bottomDrawerContentStyle}>
            <BudgetSettings
              expenses={expenses}
              onClose={handleCloseBudgetSettings}
            />
          </div>
        </div>
      )}
    </main>
  );
}

const bottomDrawerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 999,
};

const bottomDrawerContentStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'white',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  maxHeight: '80vh',
  overflowY: 'auto',
  animation: 'slideUp 0.3s ease-out',
};

export default App

