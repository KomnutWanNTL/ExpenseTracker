
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

import React, { useState } from 'react';

function Summary({ expenses, month }: SummaryProps) {
  const [pieMode, setPieMode] = useState<'month' | 'today'>('month');
  // referenceDate: วันนี้ถ้าเลือกเดือนปัจจุบัน, วันสุดท้ายของเดือนถ้าเลือกเดือนอื่น
  const currentMonth = dayjs().tz('Asia/Bangkok').format('YYYY-MM');
  const isCurrentMonth = !month || month === currentMonth;
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
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              padding: '12px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#0369a1', marginBottom: '4px' }}>
              วันนี้
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0369a1' }}>
              {formatAmount(todayTotal)}
            </div>
          </div>
        )}
        <div
          style={{
            backgroundColor: '#e0e7ff',
            borderRadius: '8px',
            padding: '12px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#3730a3', marginBottom: '4px' }}>
            {monthLabel}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3730a3' }}>
            {formatAmount(monthlyTotal)}
          </div>
        </div>
      </div>

      <div style={{marginBottom: 24}}>
        <div style={{display:'flex',alignItems:'center',gap:12,margin:'8px 0 8px 8px',minHeight:42}}>
          <h3 style={{fontSize:'1.05rem',color:'#0369a1',margin:0}}>สัดส่วนรายจ่าย (หมวดหมู่)</h3>
          {isCurrentMonth && (
            <div style={{marginLeft:'auto'}}>
              <button
                onClick={() => setPieMode('today')}
                style={{
                  background: pieMode === 'today' ? '#f59e42' : '#f3f4f6',
                  color: pieMode === 'today' ? '#fff' : '#f59e42',
                  border: 'none',
                  borderRadius: 6,
                  padding: '2px 10px',
                  minHeight: 36,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginRight: 12,
                  fontWeight: 600,
                  boxShadow: pieMode === 'today' ? '0 2px 8px #f59e4280' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                วันนี้
              </button>
              <button
                onClick={() => setPieMode('month')}
                style={{
                  background: pieMode === 'month' ? '#2563eb' : '#f3f4f6',
                  color: pieMode === 'month' ? '#fff' : '#2563eb',
                  border: 'none',
                  borderRadius: 6,
                  padding: '2px 10px',
                  minHeight: 36,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: pieMode === 'month' ? '0 2px 8px #2563eb80' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                เดือนนี้
              </button>
            </div>
          )}
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
