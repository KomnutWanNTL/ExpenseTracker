

import './App.css'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useEffect, useMemo, useRef, useState } from 'react';

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

const CATEGORY_LABELS: Record<Expense['category'], string> = {
  food: 'อาหาร',
  transport: 'เดินทาง',
  shopping: 'ช็อปปิ้ง',
  bills: 'บิล',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  family: 'ครอบครัว',
  other: 'อื่น ๆ',
};

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
  const [selectedCategory, setSelectedCategory] = useState<'all' | Expense['category']>('all');

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
  const monthFilteredExpenses = useMemo(
    () => expenses.filter(e => e.date.startsWith(selectedMonth)),
    [expenses, selectedMonth]
  );
  const availableCategories = useMemo(
    () => Array.from(new Set(monthFilteredExpenses.map(e => e.category))).sort(),
    [monthFilteredExpenses]
  );
  const filteredExpenses = useMemo(
    () => (selectedCategory === 'all'
      ? monthFilteredExpenses
      : monthFilteredExpenses.filter(e => e.category === selectedCategory)),
    [monthFilteredExpenses, selectedCategory]
  );

  useEffect(() => {
    if (selectedCategory !== 'all' && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [availableCategories, selectedCategory]);

  // Pagination logic
  const totalItems = filteredExpenses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedExpenses = filteredExpenses.slice((page - 1) * pageSize, page * pageSize);
  // Reset page if pageSize or filteredExpenses change
  // (useEffect is safer, but for simplicity, reset page to 1 if page > totalPages)
  if (page > totalPages) setPage(1);

  const isCurrentMonth = selectedMonth === getLocalDateString().slice(0, 7);

  return (
    <main className="container">
      <div className="bg-orb bg-orb-top" />
      <div className="bg-orb bg-orb-bottom" />

      <div className="app-shell">
        <header className="app-header-row card-surface">
          <div>
            <h1 className="app-title">Expense Tracker</h1>
            <p className="app-subtitle">บันทึกรายจ่ายให้ชัดเจนขึ้นในทุกวัน</p>
          </div>
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

        <section className="card-surface control-panel">
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
            <div className="status-banner status-banner-info">{autoCategoryMsg}</div>
          )}
          {error && <div className="status-banner status-banner-error">{error}</div>}
        </section>

        <Summary expenses={expenses} month={selectedMonth} />
        {budgets.length > 0 && <BudgetStatus budgets={budgets} expenses={filteredExpenses} />}

        <section className="card-surface expense-section">
          <div className="expense-toolbar">
            <div className="expense-toolbar-left">
              <label htmlFor="pageSize" className="expense-toolbar-label">แสดงต่อหน้า</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="app-select page-size-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <label htmlFor="categoryFilter" className="expense-toolbar-label">หมวดหมู่</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value as 'all' | Expense['category']);
                  setPage(1);
                }}
                className="app-select category-filter-select"
              >
                <option value="all">ทั้งหมด</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </div>
            <div className="expense-toolbar-meta">
              {totalItems > 0 && (
                <span>{`หน้า ${page} / ${totalPages} (${totalItems} รายการ)`}</span>
              )}
            </div>
          </div>

          <ExpenseList
            expenses={pagedExpenses}
            onEdit={isCurrentMonth ? handleEdit : undefined}
            onDelete={isCurrentMonth ? handleDelete : undefined}
          />

          <div className="pagination-row">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={totalPages === 1 || page === 1}
              className="app-btn app-btn-secondary nav-btn"
            >
              ก่อนหน้า
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={totalPages === 1 || page === totalPages}
              className="app-btn app-btn-secondary nav-btn"
            >
              ถัดไป
            </button>
          </div>
        </section>
      </div>

      {editingExpense && isCurrentMonth && (
        <EditExpense
          expense={editingExpense}
          onSave={handleSaveEdit}
          onClose={() => setEditingExpense(null)}
        />
      )}
      {showBudgetSettings && (
        <div className="bottom-drawer-overlay">
          <div className="bottom-drawer-content">
            <BudgetSettings expenses={expenses} onClose={handleCloseBudgetSettings} />
          </div>
        </div>
      )}
    </main>
  );
}

export default App

