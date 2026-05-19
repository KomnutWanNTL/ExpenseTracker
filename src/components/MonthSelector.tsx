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
    <div className="month-selector">
      <span className="month-selector-label">ดูข้อมูลเดือน</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="app-select month-selector-select"
      >
        {months.map(m => (
          <option key={m} value={m}>{formatMonthLabel(m)}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
