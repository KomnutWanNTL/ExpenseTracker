import { Bar, Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, BarElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(LineElement, PointElement, BarElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

interface DailyLineChartProps {
  data: DailyTotal[];
  chartType?: 'line' | 'bar';
}

export default function DailyLineChart({ data, chartType = 'line' }: DailyLineChartProps) {
  if (!data.length) return <div style={{textAlign:'center',color:'#888'}}>ไม่มีข้อมูลรายวัน</div>;

  const chartData = {
    labels: data.map(d => d.date.slice(-2)), // show day only
    datasets: [
      {
        label: 'ยอดใช้จ่าย (บาท)',
        data: data.map(d => d.total),
        fill: chartType === 'line' ? false : true,
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa',
        tension: chartType === 'line' ? 0.2 : 0,
        borderRadius: chartType === 'bar' ? 6 : 0,
        maxBarThickness: chartType === 'bar' ? 26 : undefined,
      },
    ],
  };

  const commonOptions = {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div style={{maxWidth:340,margin:'0 auto'}}>
      {chartType === 'bar' ? (
        <Bar data={chartData} options={commonOptions} />
      ) : (
        <Line data={chartData} options={commonOptions} />
      )}
    </div>
  );
}
