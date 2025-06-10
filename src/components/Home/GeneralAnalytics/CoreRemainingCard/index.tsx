import styles from './CoreRemainingCard.module.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { $latestSaleInfo, fetchCoresSold } from '@/coretime/saleInfo';
import { $purchaseHistory, purchaseHistoryRequested } from '@/coretime/purchaseHistory';
import { getNetworkChainIds } from '@/network';
import { coretimeChainBlockTime } from '@/utils';

ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, TimeScale);

export default function CoreRemainingCard() {
  const [coresRemaining, setCoresRemaining] = useState<number | null>(null);
  const [coresOffered, setCoresOffered] = useState<number | null>(null);

  const [connections, network, saleInfo, purchaseHistory] = useUnit([
    $connections,
    $network,
    $latestSaleInfo,
    $purchaseHistory,
  ]);

  useEffect(() => {
    if (!saleInfo || !network) return;

    const fetchData = async () => {
      const chainIds = getNetworkChainIds(network);
      if (!chainIds) return;

      const connection = connections[chainIds.coretimeChain];
      if (!connection || !connection.client || connection.status !== 'connected') return;

      const sold = await fetchCoresSold(network, connections);
      const offered = saleInfo.coresOffered ?? 0;

      setCoresOffered(offered);
      setCoresRemaining(offered - (sold ?? 0));
    };

    fetchData();
    purchaseHistoryRequested({ network, saleCycle: saleInfo.saleCycle });
  }, [connections, network, saleInfo]);

  const chartData = useMemo(() => {
    if (!coresOffered || purchaseHistory.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const sorted = [...purchaseHistory].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    const points = sorted.map((item, index) => ({
      x: item.timestamp,
      y: coresOffered - index - 1,
    }));

    const startPoint = {
      x: sorted[0].timestamp,
      y: coresOffered,
    };

    return {
      labels: points.map((p) => p.x),
      datasets: [
        {
          label: 'Cores Remaining',
          data: [startPoint, ...points],
          borderColor: '#58bd86',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.3,
        },
      ],
    };
  }, [purchaseHistory, coresOffered]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day',
          tooltipFormat: 'dd MMM yyyy',
          displayFormats: {
            day: 'd MMM',
          },
        },
        ticks: {
          display: true,
          autoSkip: false,
          font: {
            size: 12,
          },
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  } satisfies import('chart.js').ChartOptions<'line'>;

  return (
    <div className={`${styles.coreRemainingCard} ${styles.metricBox}`}>
      <p className={styles.label}>Cores Remaining</p>
      <h2 className={styles.value}>{coresRemaining !== null ? coresRemaining : ''}</h2>

      <div className={styles.chartWrapper}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
