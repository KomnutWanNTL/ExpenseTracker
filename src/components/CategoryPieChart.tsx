import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import type { CategoryTotal } from '../utils/summaryCalculations';
import { CATEGORY_COLORS } from '../utils/categoryColors';

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
  family: 'ครอบครัว',
  other: 'อื่น ๆ',
};


export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (!data.length) return <div style={{textAlign:'center',color:'#888'}}>ไม่มีข้อมูลรายจ่าย</div>;

  const chartData = {
    labels: data.map(d => CATEGORY_LABELS[d.category] || d.category),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: data.map(d => CATEGORY_COLORS[d.category] || '#9ca3af'),
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
