import React from 'react';

interface MonthSelectorProps {
  months: string[]; // format: YYYY-MM
  value: string; // selected month (YYYY-MM)
  onChange: (month: string) => void;
}

function formatMonthLabel(month: string) {
  // month: '2026-05' => 'พ.ค. 2026'
  const [year, m] = month.split('-');
  const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${thMonths[parseInt(m, 10) - 1]} ${year}`;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ months, value, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '12px 0' }}>
      <span style={{ fontWeight: 500, fontSize: '1rem', marginBottom: 6 }}>ดูข้อมูลเดือน</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          fontSize: '1.1rem',
          padding: '12px 16px 12px 16px',
          paddingRight: '44px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          boxSizing: 'border-box',
          background: `#fff url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 8L10 13L15 8' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 16px center/20px 20px`,
          fontWeight: 500,
          appearance: 'none',
        }}
      >
        {months.map(m => (
          <option key={m} value={m}>{formatMonthLabel(m)}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
