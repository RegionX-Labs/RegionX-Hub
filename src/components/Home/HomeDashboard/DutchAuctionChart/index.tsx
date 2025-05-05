'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import styles from './DutchAuctionChart.module.scss';
import { $latestSaleInfo, $phaseEndpoints, fetchSelloutPrice, SalePhase } from '@/coretime/saleInfo';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getCorePriceAt, getTokenSymbol, toUnit } from '@/utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DutchAuctionChart() {
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
    })()
  }, [network, connections]);

  const data = [
    {
      timestamp: phaseEndpoints?.interlude.start,
      value: toUnit(network, renewalPrice),
      phase: SalePhase.Interlude,
    },
    {
      timestamp:  phaseEndpoints?.interlude.end,
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
      value: toUnit(network, (phaseEndpoints && saleInfo) ? BigInt(getCorePriceAt(saleInfo.saleStart, saleInfo)) : BigInt(0)),
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
      categories: data.map(v => v.timestamp),
      type: 'datetime'
    },
    yaxis: {
      tickAmount: 8,
      min: 0,
      max: toUnit(network, (phaseEndpoints && saleInfo) ? BigInt(getCorePriceAt(saleInfo.saleStart, saleInfo)) : BigInt(0)),
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
          x: phaseEndpoints?.interlude.start,
          x2: phaseEndpoints?.interlude.end,
          fillColor: 'rgba(0, 255, 163, 0.05)',
          opacity: 0.3,
        },
        {
          x: phaseEndpoints?.leadin.start,
          x2: phaseEndpoints?.leadin.end,
          fillColor: 'rgba(0, 17, 255, 0.05)',
          opacity: 0.3,
        },
        {
          x: phaseEndpoints?.fixed.start,
          x2: phaseEndpoints?.fixed.end,
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
