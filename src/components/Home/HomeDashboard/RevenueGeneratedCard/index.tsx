import styles from './RevenueGeneratedCard.module.scss';
import React, { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { $purchaseHistory } from '@/coretime/purchaseHistory';
import { toUnit, getTokenSymbol } from '@/utils';
import { $network } from '@/api/connection';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip, Filler);

export default function RevenueGeneratedCard() {
  const [purchaseHistory, network] = useUnit([$purchaseHistory, $network]);

  const { chartData, totalRevenue } = useMemo(() => {
    const sorted = [...purchaseHistory].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    let cumulative = 0;
    const data = sorted.map((item) => {
      cumulative += item.price;
      return { x: item.timestamp, y: toUnit(network, BigInt(cumulative)) };
    });

    return {
      chartData: {
        labels: data.map((p) => p.x),
        datasets: [
          {
            data,
            borderColor: '#58bd86',
            borderWidth: 2,
            pointRadius: 0,
            fill: {
              target: 'origin',
              above: 'rgba(0, 255, 178, 0.08)',
            },
            tension: 0.4,
          },
        ],
      },
      totalRevenue: toUnit(network, BigInt(cumulative)),
    };
  }, [purchaseHistory, network]);

  const tokenSymbol = getTokenSymbol(network);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#888',
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          font: { size: 10 },
          color: '#888',
          callback: (val: any) => `${val} ${tokenSymbol}`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y} ${tokenSymbol}`,
        },
      },
    },
  } satisfies import('chart.js').ChartOptions<'line'>;

  return (
    <div className={styles.revenueCard}>
      <p className={styles.label}>Revenue Generated</p>
      <h2 className={styles.total}>
        {totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 10 })} {tokenSymbol}
      </h2>
      <div className={styles.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
