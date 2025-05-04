'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import styles from './DutchAuctionChart.module.scss';
import { $latestSaleInfo, fetchSelloutPrice, SalePhase } from '@/coretime/saleInfo';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getTokenSymbol, toUnit } from '@/utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DutchAuctionChart() {
  const connections = useUnit($connections);
  const network = useUnit($network);
  const saleInfo = useUnit($latestSaleInfo);

  const [renewalPrice, setRenewalPrice] = useState<bigint>(BigInt(0));

  useEffect(() => {
    (async () => {
      const sellout = await fetchSelloutPrice(network, connections);
      if (sellout !== null) {
        setRenewalPrice(BigInt(sellout));
      }
    })()
  }, [network, connections]);

  const data = [
    {
      timestamp: 0,
      value: toUnit(network, renewalPrice),
      phase: SalePhase.Interlude,
    },
    {
      timestamp: 1,
      value: toUnit(network, renewalPrice),
      phase: SalePhase.Interlude,
    },
      {
      timestamp: 2,
      value: toUnit(network, renewalPrice),
      phase: SalePhase.Leadin,
    },
    {
      timestamp: 3,
      value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
      phase: SalePhase.Leadin,
    },
    {
      timestamp: 4,
      value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
      phase: SalePhase.FixedPrice,
    },
    {
      timestamp: 5,
      value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
      phase: SalePhase.FixedPrice,
    },
  ];

  const series = [
    {
      name: 'Interlude Period',
      data: data.map(({ phase, value }) => (phase === SalePhase.Interlude ? value : null)),
    },
    {
      name: 'Leadin Period',
      data: data.map(({ phase, value }) => (phase === SalePhase.Leadin ? value : null)),
    },
    {
      name: 'Fixed Price Period',
      data: data.map(({ phase, value }) => (phase === SalePhase.FixedPrice ? value : null)),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 300,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      width: [2, 2],
      curve: 'straight',
      dashArray: [0, 7],
    },
    markers: {
      size: 0,
      strokeWidth: 0,
    },
    xaxis: {
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: data.map(v => v.timestamp)
    },
    yaxis: {
      tickAmount: 4,
      min: 0,
      // max: toUnit(network, BigInt(saleInfo?.endPrice || '0')) * 2,
      labels: {
        style: { colors: '#888' },
        formatter: (val: number) => `${val} ${getTokenSymbol(network)}`,
      },
    },
    grid: {
      show: true,
      borderColor: '#333',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    annotations: {
      xaxis: [
        {
          x: 0,
          x2: 1,
          fillColor: 'rgba(0, 255, 163, 0.05)',
          opacity: 0.3,
        },
        {
          x: 1,
          x2: 4,
          fillColor: 'rgba(0, 17, 255, 0.05)',
          opacity: 0.3,
        },
        {
          x: 4,
          x2: 5,
          fillColor: 'rgba(136, 136, 136, 0.05)',
          opacity: 0.3,
        },
      ],
    },
    tooltip: {
      theme: 'dark',
      shared: false,
      intersect: false,
    },
    legend: {
      show: false,
    },
    colors: ['#00FFA3', '#888'],
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.backgroundLabels}>
        <span className={styles.interlude}>Interlude</span>
        <span className={styles.leadin}>Leadin</span>
        <span className={styles.fixed}>Fixed Price</span>
      </div>
      <div className={styles.title}>Dutch Auction Chart</div>
      <ReactApexChart options={options} series={series} type='line' height={300} />
    </div>
  );
}
