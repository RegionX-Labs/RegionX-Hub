'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import styles from './DutchAuctionChart.module.scss';
import {
  $latestSaleInfo,
  $phaseEndpoints,
  fetchSelloutPrice,
  SalePhase,
} from '@/coretime/saleInfo';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getCorePriceAt, getTokenSymbol, toUnit } from '@/utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DutchAuctionChartProps {
  theme: 'light' | 'dark';
}

export default function DutchAuctionChart({ theme }: DutchAuctionChartProps) {
  const connections = useUnit($connections);
  const network = useUnit($network);
  const saleInfo = useUnit($latestSaleInfo);
  const phaseEndpoints = useUnit($phaseEndpoints);

  const [renewalPrice, setRenewalPrice] = useState<bigint>(BigInt(0));

  useEffect(() => {
    (async () => {
      const sellout = await fetchSelloutPrice(network, connections);
      if (sellout !== null) {
        setRenewalPrice(BigInt(sellout));
      }
    })();
  }, [network, connections]);

  const data = [
    {
      timestamp: phaseEndpoints?.interlude.start,
      value: toUnit(network, renewalPrice),
      phase: SalePhase.Interlude,
    },
    {
      timestamp: phaseEndpoints?.interlude.end,
      value: toUnit(network, renewalPrice),
      phase: SalePhase.Interlude,
    },
    {
      timestamp: phaseEndpoints?.interlude.end,
      value: toUnit(network, renewalPrice),
      phase: SalePhase.Leadin,
    },
    {
      timestamp: phaseEndpoints?.leadin.start,
      value: toUnit(
        network,
        phaseEndpoints && saleInfo
          ? BigInt(getCorePriceAt(saleInfo.saleStart, saleInfo))
          : BigInt(0)
      ),
      phase: SalePhase.Leadin,
    },
    {
      timestamp: phaseEndpoints?.leadin.end,
      value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
      phase: SalePhase.Leadin,
    },
    {
      timestamp: phaseEndpoints?.fixed.start,
      value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
      phase: SalePhase.FixedPrice,
    },
    {
      timestamp: phaseEndpoints?.fixed.end,
      value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
      phase: SalePhase.FixedPrice,
    },
  ];

  data.push({
    timestamp: ((phaseEndpoints?.leadin.start || 0) + (phaseEndpoints?.leadin.end || 0)) / 2,
    value: toUnit(network, BigInt(saleInfo?.endPrice || '0') * BigInt(10)),
    phase: SalePhase.Leadin,
  });

  data.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

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
      toolbar: { show: false },
      zoom: { enabled: false },
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
      categories: data.map((v) => v.timestamp),
      type: 'datetime',
    },
    yaxis: {
      tickAmount: 8,
      min: 0,
      max: toUnit(
        network,
        phaseEndpoints && saleInfo
          ? BigInt(getCorePriceAt(saleInfo.saleStart, saleInfo))
          : BigInt(0)
      ),
      labels: {
        style: { colors: theme === 'dark' ? '#aaa' : '#444' },
        formatter: (val: number) => `${val} ${getTokenSymbol(network)}`,
      },
    },
    grid: {
      show: true,
      borderColor: theme === 'dark' ? '#828c85' : 'rgba(175, 175, 175, 0.25)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    annotations: {
      xaxis: [
        {
          x: phaseEndpoints?.interlude.start,
          x2: phaseEndpoints?.interlude.end,
          fillColor: theme === 'dark' ? 'rgba(0, 255, 163, 0.10)' : 'rgba(0, 200, 140, 0.12)',
          opacity: 0.5,
        },
        {
          x: phaseEndpoints?.leadin.start,
          x2: phaseEndpoints?.leadin.end,
          fillColor: theme === 'dark' ? 'rgba(0, 17, 255, 0.1)' : 'rgba(50, 80, 255, 0.12)',
          opacity: 0.5,
        },
        {
          x: phaseEndpoints?.fixed.start,
          x2: phaseEndpoints?.fixed.end,
          fillColor: theme === 'dark' ? 'rgba(136, 136, 136, 0.05)' : 'rgba(100, 100, 100, 0.06)',
          opacity: 0.6,
        },
        {
          x: Date.now(),
          borderColor: theme === 'dark' ? '#3B82F6' : '#1C64F2',
          strokeDashArray: 4,
          label: {
            text: 'Now',
            style: {
              color: theme === 'dark' ? '#fff' : '#000',
              background: theme === 'dark' ? '#3B82F6' : '#B3D4FF',
              fontWeight: 500,
            },
            orientation: 'horizontal',
            offsetY: -10,
          },
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
    colors: ['#58bd86', '#888'],
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
