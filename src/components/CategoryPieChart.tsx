import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import type { CategoryTotal } from '../utils/summaryCalculations';

Chart.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  data: CategoryTotal[];
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'อาหาร',
  transport: 'เดินทาง',
  shopping: 'ช็อปปิ้ง',
  bills: 'บิล',
  entertainment: 'บันเทิง',
  health: 'สุขภาพ',
  other: 'อื่น ๆ',
};

const COLORS = [
  '#60a5fa', // food
  '#fbbf24', // transport
  '#f472b6', // shopping
  '#a78bfa', // bills
  '#34d399', // entertainment
  '#f87171', // health
  '#9ca3af', // other
];

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (!data.length) return <div style={{textAlign:'center',color:'#888'}}>ไม่มีข้อมูลรายจ่าย</div>;

  const chartData = {
    labels: data.map(d => CATEGORY_LABELS[d.category] || d.category),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: COLORS.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{maxWidth:340,margin:'0 auto'}}>
      <Pie data={chartData} options={{plugins:{legend:{position:'bottom'}}}} />
    </div>
  );
}
