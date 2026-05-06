

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
import { getCategoryForNote } from './storage/noteCategoryMapping';
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
  // State for showing auto-category notification
  const [autoCategoryMsg, setAutoCategoryMsg] = useState<string | null>(null);
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
    if (!window.confirm('คุณต้องการลบรายการนี้หรือไม่?')) return;
    const filtered = expenses.filter(e => e.id !== id);
    setExpenses(filtered);
    saveExpenses(filtered);
    console.log('Saved expenses (after delete):', filtered);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
  }

  function handleSaveEdit(updatedExpense: Expense) {
    if (!window.confirm('คุณต้องการบันทึกการแก้ไขรายการนี้หรือไม่?')) return;
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
    // Use learned category if available, else auto-detect
    const learnedCategory = getCategoryForNote(parsed.note);
    let category = learnedCategory || detectCategoryFromNote(parsed.note);
    if (learnedCategory) {
      setAutoCategoryMsg('หมวดหมู่ถูกเลือกให้อัตโนมัติจากที่เคยตั้งไว้');
    } else {
      setAutoCategoryMsg(null);
    }
    const expense: Expense = {
      id: crypto.randomUUID(),
      note: parsed.note,
      amount: parsed.amount,
      category,
      date: getLocalDateString(),
      createdAt: dayjs().tz('Asia/Bangkok').toISOString(),
    };
    const newExpenses = [expense, ...expenses];
    saveExpenses(newExpenses);
    setExpenses(newExpenses);
    console.log('Saved expenses (after add):', newExpenses);
    setInput('');
    // Clear auto-category message after a short delay
    setTimeout(() => setAutoCategoryMsg(null), 2000);
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

  const isCurrentMonth = selectedMonth === getLocalDateString().slice(0, 7);

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
            disabled={!isCurrentMonth}
          />
          <button
            className="header-btn budget-btn"
            onClick={() => setShowBudgetSettings(true)}
            disabled={!isCurrentMonth}
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
        disabled={isSubmitting || !isCurrentMonth}
        ref={inputRef}
      />
      {autoCategoryMsg && (
        <div style={{ color: '#2563eb', fontSize: '0.98rem', padding: '6px 12px', backgroundColor: '#e0e7ff', borderRadius: '8px', marginTop: 4, marginBottom: 4 }}>
          {autoCategoryMsg}
        </div>
      )}
      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.98rem', padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{error}</div>
      )}
      <Summary expenses={expenses} month={selectedMonth} />
      {budgets.length > 0 && <BudgetStatus budgets={budgets} expenses={filteredExpenses} />}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="pageSize" style={{ fontSize: '0.98rem', fontWeight: 500, marginRight: 2 }}>แสดงต่อหน้า</label>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select
                id="pageSize"
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="app-select"
                style={{ minWidth: 70, paddingRight: 32 }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              {/* Arrow icon overlay for dropdown */}
              <span style={{
                pointerEvents: 'none',
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                height: 18
              }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" fill="#2563eb"/>
                </svg>
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.98rem', color: '#374151', minWidth: 120, textAlign: 'right' }}>
            {totalItems > 0 && (
              <span>
                {`หน้า ${page} / ${totalPages} (${totalItems} รายการ)`}
              </span>
            )}
          </div>
        </div>
        <ExpenseList
          expenses={pagedExpenses}
          onEdit={isCurrentMonth ? handleEdit : undefined}
          onDelete={isCurrentMonth ? handleDelete : undefined}
        />
        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '16px 0' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={totalPages === 1 || page === 1}
            className="app-btn app-btn-secondary"
            style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6, minWidth: 90 }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 4 }}>
              <path d="M13 15l-5-5 5-5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ก่อนหน้า
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={totalPages === 1 || page === totalPages}
            className="app-btn app-btn-secondary"
            style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6, minWidth: 90 }}
          >
            ถัดไป
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4 }}>
              <path d="M7 5l5 5-5 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>
      {editingExpense && isCurrentMonth && (
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

