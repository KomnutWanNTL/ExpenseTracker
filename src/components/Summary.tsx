
import { formatAmount } from '../utils/formatters';
import {
  calculateTodayTotal,
  calculateMonthlyTotal,
  groupCurrentMonthByCategory,
  groupCurrentMonthByDay,
} from '../utils/summaryCalculations';
import { groupTodayByCategory } from '../utils/groupTodayByCategory';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import CategoryPieChart from './CategoryPieChart';
import DailyLineChart from './DailyLineChart';
import type { Expense } from '../types/expense';

interface SummaryProps {
  expenses: Expense[];
  month?: string; // YYYY-MM
}

import React, { useState, useEffect } from 'react';


function Summary({ expenses, month }: SummaryProps) {
  const currentMonth = dayjs().tz('Asia/Bangkok').format('YYYY-MM');
  const isCurrentMonth = !month || month === currentMonth;
  // Default pieMode: 'today' ถ้าเดือนปัจจุบัน, 'month' ถ้าเดือนย้อนหลัง
  const [pieMode, setPieMode] = useState<'month' | 'today'>(isCurrentMonth ? 'today' : 'month');
  const [dailyChartType, setDailyChartType] = useState<'line' | 'bar'>('bar');
  // Reset pieMode เมื่อ month เปลี่ยน
  useEffect(() => {
    setPieMode(isCurrentMonth ? 'today' : 'month');
  }, [month]);
  // referenceDate: วันนี้ถ้าเลือกเดือนปัจจุบัน, วันสุดท้ายของเดือนถ้าเลือกเดือนอื่น
  const referenceDate = isCurrentMonth
    ? dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD')
    : dayjs.tz(month + '-01', 'Asia/Bangkok').endOf('month').format('YYYY-MM-DD');
  console.log('[Summary] expenses:', expenses);
  console.log('[Summary] referenceDate:', referenceDate);

  const todayTotal = calculateTodayTotal(expenses, referenceDate);
  const monthlyTotal = calculateMonthlyTotal(expenses, referenceDate);
  const categoryData = pieMode === 'month'
    ? groupCurrentMonthByCategory(expenses, referenceDate)
    : groupTodayByCategory(expenses, referenceDate);
  const dailyData = groupCurrentMonthByDay(expenses, referenceDate);

  // Helper for Thai month names
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  let monthLabel = 'เดือนนี้';
  if (!isCurrentMonth && month) {
    const [y, m] = month.split('-');
    const thaiMonth = thaiMonths[parseInt(m, 10) - 1];
    monthLabel = `${thaiMonth} ${parseInt(y, 10) + 543}`; // พ.ศ.
  }

  return (
    <section className="card-surface summary-section">
      <div className={`summary-cards ${isCurrentMonth ? 'summary-cards-two' : ''}`}>
        {isCurrentMonth && (
          <div
            className={`summary-card summary-card-today ${pieMode === 'today' ? 'summary-card-active' : ''}`}
            onClick={() => setPieMode('today')}
            title="ดูสรุปวันนี้"
          >
            <div className="summary-card-label">
              วันนี้
            </div>
            <div className="summary-card-value">
              {formatAmount(todayTotal)}
            </div>
          </div>
        )}
        <div
          className={`summary-card summary-card-month ${pieMode === 'month' ? 'summary-card-active' : ''}`}
          onClick={() => setPieMode('month')}
          title="ดูสรุปเดือนนี้"
        >
          <div className="summary-card-label">
            {monthLabel}
          </div>
          <div className="summary-card-value">
            {formatAmount(monthlyTotal)}
          </div>
        </div>
      </div>

      <div className="summary-chart-block">
        <div className="summary-chart-header">
          <h3 className="summary-chart-title">
            {pieMode === 'today' ? 'Summary วันนี้ (หมวดหมู่)' : 'Summary เดือนนี้ (หมวดหมู่)'}
          </h3>
        </div>
        <CategoryPieChart data={categoryData} />
      </div>
      <div className="summary-chart-block">
        <div className="summary-chart-header summary-chart-header-with-actions">
          <h3 className="summary-chart-title">แนวโน้มรายวัน (บาท)</h3>
          <div className="chart-type-toggle" role="group" aria-label="เลือกประเภทกราฟรายวัน">
            <button
              type="button"
              className={`chart-type-btn ${dailyChartType === 'bar' ? 'chart-type-btn-active' : ''}`}
              onClick={() => setDailyChartType('bar')}
            >
              แท่ง
            </button>
            <button
              type="button"
              className={`chart-type-btn ${dailyChartType === 'line' ? 'chart-type-btn-active' : ''}`}
              onClick={() => setDailyChartType('line')}
            >
              เส้น
            </button>
          </div>
        </div>
        <DailyLineChart data={dailyData} chartType={dailyChartType} />
      </div>
    </section>
  );
}

export default Summary;
