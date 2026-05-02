

import './App.css'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState, useRef } from 'react';

import QuickAddExpense from './components/QuickAddExpense';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import EditExpense from './components/EditExpense';
import BudgetSettings from './components/BudgetSettings';
import BudgetStatus from './components/BudgetStatus';
import ImportExpenses from './components/ImportExpenses';

import { parseExpenseInput } from './utils/expenseParser';
import { detectCategoryFromNote } from './utils/categoryDetection';
import { saveExpenses, loadExpenses } from './storage/expenseStorage';
import MonthSelector from './components/MonthSelector';
import { loadBudgets } from './storage/budgetStorage';
import { downloadExpensesAsCSV } from './utils/csvExport';

dayjs.extend(utc);
dayjs.extend(timezone);
import type { Expense } from './types/expense';

// Always use Thailand local date (YYYY-MM-DD) using dayjs
function getLocalDateString(): string {
  return dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD');
}

function getAllMonths(expenses: Expense[]): string[] {
  // Return all months in format YYYY-MM, sorted desc, unique
  const months = Array.from(new Set(expenses.map(e => e.date.slice(0, 7))));
  return months.sort((a, b) => b.localeCompare(a));
}


function App() {
  // State for quick add input
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const loaded = loadExpenses();
    console.log('Loaded expenses:', loaded);
    return loaded;
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [budgets, setBudgets] = useState(() => loadBudgets());
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  // Month selector state
  const allMonths = getAllMonths(expenses);
  const defaultMonth = allMonths.length > 0 ? allMonths[0] : getLocalDateString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const lastSubmit = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  function handleDelete(id: string) {
    const filtered = expenses.filter(e => e.id !== id);
    setExpenses(filtered);
    saveExpenses(filtered);
    console.log('Saved expenses (after delete):', filtered);
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
    console.log('Saved expenses (after edit):', updated);
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
      createdAt: dayjs().tz('Asia/Bangkok').toISOString(),
    };
    const newExpenses = [expense, ...expenses];
    saveExpenses(newExpenses);
    setExpenses(newExpenses);
    console.log('Saved expenses (after add):', newExpenses);
    setInput('');
    setIsSubmitting(false);
    setError(null);
    // Restore focus after save
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  }


  // Filter expenses by selected month
  const filteredExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));
  // Pagination logic
  const totalItems = filteredExpenses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedExpenses = filteredExpenses.slice((page - 1) * pageSize, page * pageSize);
  // Reset page if pageSize or filteredExpenses change
  // (useEffect is safer, but for simplicity, reset page to 1 if page > totalPages)
  if (page > totalPages) setPage(1);

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
          <ImportExpenses
            onImport={merged => {
              setExpenses(merged);
              saveExpenses(merged);
              alert('นำเข้าข้อมูลสำเร็จ!');
            }}
          />
          <button
            className="header-btn budget-btn"
            onClick={() => setShowBudgetSettings(true)}
          >
            Budget
          </button>
        </div>
      </header>
      <MonthSelector
        months={allMonths.length > 0 ? allMonths : [defaultMonth]}
        value={selectedMonth}
        onChange={setSelectedMonth}
      />
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
      <Summary expenses={expenses} month={selectedMonth} />
      {budgets.length > 0 && <BudgetStatus budgets={budgets} expenses={filteredExpenses} />}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <label htmlFor="pageSize" style={{ fontSize: '0.95rem', marginRight: 8 }}>แสดงต่อหน้า:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="app-select"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div style={{ fontSize: '0.95rem' }}>
            {totalItems > 0 && (
              <span>
                {`หน้า ${page} / ${totalPages} (${totalItems} รายการ)`}
              </span>
            )}
          </div>
        </div>
        <ExpenseList
          expenses={pagedExpenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="app-btn app-btn-secondary"
              style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 4 }}>
                  <path d="M13 15l-5-5 5-5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ก่อนหน้า
              </span>
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="app-btn app-btn-secondary"
              style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                ถัดไป
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4 }}>
                  <path d="M7 5l5 5-5 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        )}
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

