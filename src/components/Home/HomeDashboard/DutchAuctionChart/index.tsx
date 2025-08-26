'use client';

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './DutchAuctionChart.module.scss';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, $phaseEndpoints, fetchSelloutPrice } from '@/coretime/saleInfo';
import { $connections, $network } from '@/api/connection';
import { getCorePriceAt, toUnit, getTokenSymbol } from '@/utils';

interface DutchAuctionChartProps {
  theme: 'light' | 'dark';
  view?: string;
  mode?: 'full' | 'mini';
  height?: number;
  context?: 'card' | 'modal';
}

export default function DutchAuctionChart({
  theme,
  view,
  mode = 'full',
  height,
  context = 'card',
}: DutchAuctionChartProps) {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const saleInfo = useUnit($latestSaleInfo);
  const phaseEndpoints = useUnit($phaseEndpoints);
  const [renewalPrice, setRenewalPrice] = useState<bigint>(BigInt(0));

  useEffect(() => {
    (async () => {
      const sellout = await fetchSelloutPrice(network, connections);
      if (sellout !== null) setRenewalPrice(BigInt(sellout));
    })();
  }, [network, connections]);

  const now = Date.now();
  let chartContent: React.ReactNode = <div />;

  if (
    phaseEndpoints &&
    phaseEndpoints.leadin &&
    phaseEndpoints.fixed &&
    phaseEndpoints.interlude &&
    saleInfo
  ) {
    const points = [
      {
        timestamp: phaseEndpoints.interlude.start,
        value: toUnit(network, renewalPrice),
        phase: 'Interlude',
      },
      {
        timestamp: phaseEndpoints.interlude.end,
        value: toUnit(network, renewalPrice),
        phase: 'Interlude',
      },

      {
        timestamp: phaseEndpoints.interlude.end,
        value: toUnit(network, renewalPrice),
        phase: 'Leadin',
      },
      {
        timestamp: phaseEndpoints.leadin.start,
        value: toUnit(network, BigInt(getCorePriceAt(saleInfo.saleStart, saleInfo, network))),
        phase: 'Leadin',
      },
      {
        timestamp: (phaseEndpoints.leadin.start + phaseEndpoints.leadin.end) / 2,
        value: toUnit(network, BigInt(saleInfo?.endPrice || '0') * BigInt(10)),
        phase: 'Leadin',
      },
      {
        timestamp: phaseEndpoints.leadin.end,
        value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
        phase: 'Leadin',
      },

      {
        timestamp: phaseEndpoints.fixed.start,
        value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
        phase: 'Fixed',
      },
      {
        timestamp: phaseEndpoints.fixed.end,
        value: toUnit(network, BigInt(saleInfo?.endPrice || '0')),
        phase: 'Fixed',
      },
    ];

    const values = points.map((p) => p.value);
    const maxPrice = Math.max(...values);
    const tickCount = 8;
    const step = maxPrice / tickCount;
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => +(i * step).toFixed(3));

    const isMini = mode === 'mini';
    const chartHeight = height ?? (isMini ? 12 : 300);

    const seriesLines = [
      {
        name: 'Interlude',
        type: 'line',
        smooth: false,
        showSymbol: !isMini,
        symbol: 'circle',
        symbolSize: isMini ? 0 : 6,
        lineStyle: { width: isMini ? 1 : 2, color: '#00ff9d' },
        itemStyle: !isMini ? { color: '#ffffff', borderColor: '#ffffff' } : undefined,
        data: points.filter((p) => p.phase === 'Interlude').map((p) => [p.timestamp, p.value]),
        z: 3,
      },
      {
        name: 'Leadin',
        type: 'line',
        smooth: false,
        showSymbol: !isMini,
        symbol: 'circle',
        symbolSize: isMini ? 0 : 6,
        lineStyle: { width: isMini ? 1 : 2, color: '#888', type: 'dashed' },
        itemStyle: !isMini ? { color: '#ffffff', borderColor: '#ffffff' } : undefined,
        data: points.filter((p) => p.phase === 'Leadin').map((p) => [p.timestamp, p.value]),
        z: 3,
      },
      {
        name: 'Fixed',
        type: 'line',
        smooth: false,
        showSymbol: !isMini,
        symbol: 'circle',
        symbolSize: isMini ? 0 : 6,
        lineStyle: { width: isMini ? 1 : 2, color: '#00ff9d' },
        itemStyle: !isMini ? { color: '#ffffff', borderColor: '#ffffff' } : undefined,
        data: points.filter((p) => p.phase === 'Fixed').map((p) => [p.timestamp, p.value]),
        z: 3,
      },
    ];

    const phaseBackgroundSeries = {
      name: 'Phase Backgrounds',
      type: 'line',
      data: [],
      z: 0,
      markArea: {
        silent: true,
        itemStyle: { opacity: 0.25 },
        label: { show: true, color: '#aaa', fontWeight: 'bold', fontSize: 12 },
        data: [
          [
            {
              name: 'Interlude',
              xAxis: phaseEndpoints.interlude.start,
              itemStyle: {
                color: theme === 'dark' ? 'rgba(0, 255, 163, 0.10)' : 'rgba(0, 200, 140, 0.23)',
              },
            },
            { xAxis: phaseEndpoints.interlude.end },
          ],
          [
            {
              name: 'Leadin',
              xAxis: phaseEndpoints.leadin.start,
              itemStyle: {
                color: theme === 'dark' ? 'rgba(0, 17, 255, 0.10)' : 'rgba(51, 62, 212, 0.35)',
              },
            },
            { xAxis: phaseEndpoints.leadin.end },
          ],
          [
            {
              name: 'Fixed Price',
              xAxis: phaseEndpoints.fixed.start,
              itemStyle: {
                color: theme === 'dark' ? 'rgba(160, 0, 0, 0.05)' : 'rgba(87, 87, 87, 0.27)',
              },
            },
            { xAxis: phaseEndpoints.fixed.end },
          ],
        ],
      },
    };

    const miniOption = {
      animation: false,
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      backgroundColor: 'transparent',
      tooltip: { show: false },
      xAxis: { type: 'time', show: false },
      yAxis: { type: 'value', min: 0, max: Math.max(...ticks), show: false },
      series: seriesLines,
    };

    const fullOption = {
      grid: { left: 80, right: 10, top: 40, bottom: 40 },
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            formatter: (params: any) =>
              params.axisDimension === 'x'
                ? new Date(params.value).toLocaleDateString()
                : `${params.value.toFixed(2)} ${getTokenSymbol(network)}`,
          },
        },
        formatter: (params: any[]) => {
          const item = params.find((p) => ['Interlude', 'Leadin', 'Fixed'].includes(p.seriesName));
          if (!item) return '';
          const d = new Date(item.data[0]);
          const dateTime =
            d.toLocaleDateString() +
            ' ' +
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          const price = item.data[1];
          return `${dateTime}<br/>Price: ${price.toLocaleString()} ${getTokenSymbol(network)}`;
        },
      },
      xAxis: {
        type: 'time',
        axisLine: { lineStyle: { color: theme === 'dark' ? '#888' : '#444' } },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: theme === 'dark' ? '#888' : '#444' } },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: theme === 'dark' ? 'rgba(0,0,0,0.49)' : 'rgba(85,85,85,0.28)',
          },
        },
        min: 0,
        max: Math.max(...ticks),
        interval: step,
        axisLabel: {
          show: true,
          hideOverlap: false,
          formatter: (val: number) => `${val.toFixed(2)} ${getTokenSymbol(network)}`,
          fontSize: 10,
          color: theme === 'dark' ? '#aaa' : '#444',
        },
      },
      series: [
        phaseBackgroundSeries,
        ...seriesLines,
        {
          name: 'Tooltip Tracker',
          type: 'line',
          showSymbol: false,
          lineStyle: { opacity: 0 },
          itemStyle: { opacity: 0 },
          emphasis: { disabled: true },
          tooltip: { show: false },
          data: [],
          markLine: {
            symbol: 'none',
            label: {
              show: true,
              formatter: 'Now',
              color: '#3B82F6',
              fontWeight: 'bold',
              position: 'insideEndBottom',
            },
            lineStyle: {
              color: theme === 'dark' ? '#3B82F6' : '#1C64F2',
              type: 'dashed',
              width: 1,
            },
            data: [{ xAxis: now }],
          },
          z: 4,
        },
      ],
    };

    const option = mode === 'mini' ? miniOption : fullOption;

    chartContent = (
      <ReactECharts
        option={option}
        style={
          context === 'modal'
            ? { width: '100%', height: '100%', flex: 1 }
            : { width: '100%', height: chartHeight }
        }
      />
    );
  }

  return (
    <div
      className={
        context === 'modal'
          ? styles.modalChart
          : `${styles.chartCard} ${view === 'Deploying a new project' ? styles.compact : ''}`
      }
    >
      {mode === 'full' && context !== 'modal' && (
        <div className={styles.title}>Dutch Auction Chart</div>
      )}
      {chartContent}
    </div>
  );
}
