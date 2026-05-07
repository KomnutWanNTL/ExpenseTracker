
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
    <section>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCurrentMonth ? '1fr 1fr' : '1fr',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {isCurrentMonth && (
          <div
            style={{
              backgroundColor: pieMode === 'today' ? '#f59e42' : '#dbeafe',
              borderRadius: '8px',
              padding: '12px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: pieMode === 'today' ? '0 2px 8px #f59e4280' : 'none',
              border: pieMode === 'today' ? '2px solid #f59e42' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
            onClick={() => setPieMode('today')}
            title="ดูสรุปวันนี้"
          >
            <div style={{ fontSize: '0.85rem', color: pieMode === 'today' ? '#fff' : '#0369a1', marginBottom: '4px' }}>
              วันนี้
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: pieMode === 'today' ? '#fff' : '#0369a1' }}>
              {formatAmount(todayTotal)}
            </div>
          </div>
        )}
        <div
          style={{
            backgroundColor: pieMode === 'month' ? '#2563eb' : '#e0e7ff',
            borderRadius: '8px',
            padding: '12px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: pieMode === 'month' ? '0 2px 8px #2563eb80' : 'none',
            border: pieMode === 'month' ? '2px solid #2563eb' : '2px solid transparent',
            transition: 'all 0.15s',
          }}
          onClick={() => setPieMode('month')}
          title="ดูสรุปเดือนนี้"
        >
          <div style={{ fontSize: '0.85rem', color: pieMode === 'month' ? '#fff' : '#3730a3', marginBottom: '4px' }}>
            {monthLabel}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: pieMode === 'month' ? '#fff' : '#3730a3' }}>
            {formatAmount(monthlyTotal)}
          </div>
        </div>
      </div>

      <div style={{marginBottom: 24}}>
        <div style={{display:'flex',alignItems:'center',gap:12,margin:'8px 0 8px 8px',minHeight:42}}>
          <h3 style={{fontSize:'1.05rem',color:'#0369a1',margin:0}}>
            {pieMode === 'today' ? 'Summary วันนี้ (หมวดหมู่)' : 'Summary เดือนนี้ (หมวดหมู่)'}
          </h3>
        </div>
        <CategoryPieChart data={categoryData} />
      </div>
      <div>
        <h3 style={{fontSize:'1.05rem',margin:'8px 0 8px 8px',color:'#0369a1'}}>แนวโน้มรายวัน (บาท)</h3>
        <DailyLineChart data={dailyData} />
      </div>
    </section>
  );
}

export default Summary;
