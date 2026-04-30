import { formatAmount } from '../utils/formatters';
import {
  calculateTodayTotal,
  calculateMonthlyTotal,
  groupCurrentMonthByCategory,
  groupCurrentMonthByDay,
} from '../utils/summaryCalculations';
import CategoryPieChart from './CategoryPieChart';
import DailyLineChart from './DailyLineChart';
import type { Expense } from '../types/expense';

interface SummaryProps {
  expenses: Expense[];
}

export default function Summary({ expenses }: SummaryProps) {
  const todayTotal = calculateTodayTotal(expenses);
  const monthlyTotal = calculateMonthlyTotal(expenses);

  const categoryData = groupCurrentMonthByCategory(expenses);
  const dailyData = groupCurrentMonthByDay(expenses);

  return (
    <section>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
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
        <div
          style={{
            backgroundColor: '#e0e7ff',
            borderRadius: '8px',
            padding: '12px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#3730a3', marginBottom: '4px' }}>
            เดือนนี้
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3730a3' }}>
            {formatAmount(monthlyTotal)}
          </div>
        </div>
      </div>

      <div style={{marginBottom: 24}}>
        <h3 style={{fontSize:'1.05rem',margin:'8px 0 8px 8px',color:'#0369a1'}}>สัดส่วนรายจ่าย (หมวดหมู่)</h3>
        <CategoryPieChart data={categoryData} />
      </div>
      <div>
        <h3 style={{fontSize:'1.05rem',margin:'8px 0 8px 8px',color:'#0369a1'}}>แนวโน้มรายวัน (บาท)</h3>
        <DailyLineChart data={dailyData} />
      </div>
    </section>
  );
}
