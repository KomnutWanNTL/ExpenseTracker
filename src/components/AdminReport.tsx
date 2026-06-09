import { useMemo, useState } from 'react';

import type { Expense } from '../types/expense';
import { formatAmount } from '../utils/formatters';

interface ReportFilters {
  startDate: string;
  endDate: string;
  category: 'all' | Expense['category'];
  keyword: string;
}

interface AdminReportProps {
  expenses: Expense[];
  categoryLabels: Record<Expense['category'], string>;
}

function toThaiDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getDefaultStartDate(expenses: Expense[]): string {
  if (expenses.length === 0) return '';
  return expenses.reduce((minDate, current) => (current.date < minDate ? current.date : minDate), expenses[0].date);
}

function getDefaultEndDate(expenses: Expense[]): string {
  if (expenses.length === 0) return '';
  return expenses.reduce((maxDate, current) => (current.date > maxDate ? current.date : maxDate), expenses[0].date);
}

export default function AdminReport({ expenses, categoryLabels }: AdminReportProps) {
  const [filters, setFilters] = useState<ReportFilters>(() => ({
    startDate: getDefaultStartDate(expenses),
    endDate: getDefaultEndDate(expenses),
    category: 'all',
    keyword: '',
  }));
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(() => ({
    startDate: getDefaultStartDate(expenses),
    endDate: getDefaultEndDate(expenses),
    category: 'all',
    keyword: '',
  }));

  const result = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();
    const filtered = expenses
      .filter(expense => {
        if (appliedFilters.startDate && expense.date < appliedFilters.startDate) return false;
        if (appliedFilters.endDate && expense.date > appliedFilters.endDate) return false;
        if (appliedFilters.category !== 'all' && expense.category !== appliedFilters.category) return false;
        if (keyword && !expense.note.toLowerCase().includes(keyword)) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.date === b.date) {
          return b.createdAt.localeCompare(a.createdAt);
        }
        return b.date.localeCompare(a.date);
      });

    const totalAmount = filtered.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      rows: filtered,
      totalAmount,
    };
  }, [expenses, appliedFilters]);

  function handleStartDateChange(startDate: string) {
    setFilters(current => ({
      ...current,
      startDate,
      endDate: current.endDate && startDate && startDate > current.endDate ? startDate : current.endDate,
    }));
  }

  function handleEndDateChange(endDate: string) {
    setFilters(current => ({
      ...current,
      endDate: current.startDate && endDate && endDate < current.startDate ? current.startDate : endDate,
    }));
  }

  function handleSearch() {
    const normalizedFilters =
      filters.startDate && filters.endDate && filters.startDate > filters.endDate
        ? { ...filters, endDate: filters.startDate }
        : filters;
    setFilters(normalizedFilters);
    setAppliedFilters(normalizedFilters);
  }

  function handleReset() {
    const resetFilters: ReportFilters = {
      startDate: getDefaultStartDate(expenses),
      endDate: getDefaultEndDate(expenses),
      category: 'all',
      keyword: '',
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  }

  return (
    <section className="card-surface admin-report-section">
      <div className="admin-report-header">
        <h2 className="admin-report-title">Admin Report</h2>
        <p className="admin-report-subtitle">ค้นหาข้อมูลย้อนหลังจากช่วงเวลาและเงื่อนไขที่ต้องการ</p>
      </div>

      <div className="admin-criteria-grid">
        <div className="admin-criteria-item">
          <label htmlFor="reportStartDate" className="expense-toolbar-label">วันที่เริ่มต้น</label>
          <input
            id="reportStartDate"
            type="date"
            className="quick-add-input admin-date-input"
            value={filters.startDate}
            onChange={event => handleStartDateChange(event.target.value)}
          />
        </div>

        <div className="admin-criteria-item">
          <label htmlFor="reportEndDate" className="expense-toolbar-label">วันที่สิ้นสุด</label>
          <input
            id="reportEndDate"
            type="date"
            className="quick-add-input admin-date-input"
            value={filters.endDate}
            onChange={event => handleEndDateChange(event.target.value)}
          />
        </div>

        <div className="admin-criteria-item">
          <label htmlFor="reportCategory" className="expense-toolbar-label">หมวดหมู่</label>
          <select
            id="reportCategory"
            className="app-select"
            value={filters.category}
            onChange={event => setFilters(current => ({ ...current, category: event.target.value as 'all' | Expense['category'] }))}
          >
            <option value="all">ทั้งหมด</option>
            {Object.entries(categoryLabels).map(([category, label]) => (
              <option key={category} value={category}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-criteria-item admin-criteria-item-wide">
          <label htmlFor="reportKeyword" className="expense-toolbar-label">ค้นหาจากโน้ต</label>
          <input
            id="reportKeyword"
            type="text"
            className="quick-add-input"
            placeholder="เช่น กาแฟ, ค่าแท็กซี่, ของใช้บ้าน"
            value={filters.keyword}
            onChange={event => setFilters(current => ({ ...current, keyword: event.target.value }))}
          />
        </div>
      </div>

      <div className="admin-action-row">
        <button type="button" className="app-btn app-btn-primary" onClick={handleSearch}>ค้นหา</button>
        <button type="button" className="app-btn app-btn-secondary" onClick={handleReset}>รีเซ็ต</button>
      </div>

      <div className="admin-result-summary">
        <span>ผลลัพธ์ {result.rows.length} รายการ</span>
        <span>ยอดรวม {formatAmount(result.totalAmount)} บาท</span>
      </div>

      {result.rows.length === 0 ? (
        <div className="expense-empty-state">ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-result-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>รายการ</th>
                <th>หมวดหมู่</th>
                <th className="align-right">จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map(expense => (
                <tr key={expense.id}>
                  <td>{toThaiDate(expense.date)}</td>
                  <td>{expense.note}</td>
                  <td>{categoryLabels[expense.category]}</td>
                  <td className="align-right">{formatAmount(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}