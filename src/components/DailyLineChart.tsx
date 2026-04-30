import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import type { DailyTotal } from '../utils/summaryCalculations';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface DailyLineChartProps {
  data: DailyTotal[];
}

export default function DailyLineChart({ data }: DailyLineChartProps) {
  if (!data.length) return <div style={{textAlign:'center',color:'#888'}}>ไม่มีข้อมูลรายวัน</div>;

  const chartData = {
    labels: data.map(d => d.date.slice(-2)), // show day only
    datasets: [
      {
        label: 'ยอดใช้จ่าย (บาท)',
        data: data.map(d => d.total),
        fill: false,
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa',
        tension: 0.2,
      },
    ],
  };

  return (
    <div style={{maxWidth:340,margin:'0 auto'}}>
      <Line data={chartData} options={{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}} />
    </div>
  );
}
