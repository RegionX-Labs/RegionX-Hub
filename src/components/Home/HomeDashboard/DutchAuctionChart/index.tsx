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
}

export default function DutchAuctionChart({ theme, view }: DutchAuctionChartProps) {
  const network = useUnit($network);
  const connections = useUnit($connections);
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

  const now = Date.now();
  let chartContent: React.ReactNode = <div></div>;

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

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          snap: true,
        },

        formatter: (params: any[]) => {
          const realPoint = params.find(
            (p) => p.seriesName !== 'Tooltip Tracker' && p.seriesName !== 'Phase Backgrounds'
          );
          if (!realPoint) return '';
          const date = new Date(realPoint.data[0]).toLocaleDateString();
          const price = realPoint.data[1];
          return `${date}<br/>Price: ${price.toLocaleString()} ${getTokenSymbol(network)}`;
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
            color: theme === 'dark' ? 'rgba(0, 0, 0, 0.49)' : 'rgba(85, 85, 85, 0.28)',
          },
        },
        min: 0,
        max: Math.max(...ticks),
        interval: step,
        axisLabel: {
          formatter: (val: number) => `${val.toFixed(2)} ${getTokenSymbol(network)}`,
          fontSize: 10,
          color: theme === 'dark' ? '#aaa' : '#444',
        },
      },
      series: [
        {
          name: 'Interlude',
          type: 'line',
          smooth: false,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 2, color: '#00ff9d' },
          itemStyle: { color: '#00ffaa' },
          data: points.filter((p) => p.phase === 'Interlude').map((p) => [p.timestamp, p.value]),
        },
        {
          name: 'Leadin',
          type: 'line',
          smooth: false,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 2, color: '#888', type: 'dashed' },
          itemStyle: { color: '#aaa' },
          data: points.filter((p) => p.phase === 'Leadin').map((p) => [p.timestamp, p.value]),
        },
        {
          name: 'Fixed',
          type: 'line',
          smooth: false,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 2, color: '#00ff9d' },
          itemStyle: { color: '#00ffaa' },
          data: points.filter((p) => p.phase === 'Fixed').map((p) => [p.timestamp, p.value]),
        },
        {
          name: 'Tooltip Tracker',
          type: 'line',
          showSymbol: false,
          lineStyle: { opacity: 0 },
          itemStyle: { opacity: 0 },
          emphasis: { disabled: true },
          tooltip: { show: false },
          data: (() => {
            const oneDay = 24 * 60 * 60 * 1000;
            const days: [number, number][] = [];
            for (
              let ts = phaseEndpoints.interlude.start;
              ts <= phaseEndpoints.fixed.end;
              ts += oneDay
            ) {
              const price = toUnit(
                network,
                (() => {
                  if (ts <= phaseEndpoints.interlude.end) return renewalPrice;
                  if (ts <= phaseEndpoints.leadin.end) {
                    return BigInt(getCorePriceAt(ts, saleInfo, network));
                  }
                  return BigInt(saleInfo?.endPrice || '0');
                })()
              );
              days.push([ts, price]);
            }
            return days;
          })(),
          markLine: {
            symbol: 'none',
            label: {
              show: true,
              formatter: 'Now',
              color: '#3B82F6',
              fontWeight: 'bold',
              position: 'insideEndTop',
            },

            lineStyle: {
              color: theme === 'dark' ? '#3B82F6' : '#1C64F2',
              type: 'dashed',

              width: 1,
            },
            data: [{ xAxis: now }],
          },
        },
        {
          name: 'Phase Backgrounds',
          type: 'line',
          data: [],
          markArea: {
            silent: true,
            itemStyle: { opacity: 0.25 },
            data: [
              [
                {
                  name: 'Interlude',
                  xAxis: phaseEndpoints.interlude.start,
                  itemStyle: {
                    color: theme === 'dark' ? 'rgba(0, 255, 163, 0.10)' : 'rgba(0, 200, 140, 0.23)',
                  },
                  label: {
                    show: true,
                    color: '#aaa',
                    fontWeight: 'bold',
                    fontSize: 12,
                  },
                },
                { xAxis: phaseEndpoints.interlude.end },
              ],
              [
                {
                  name: 'Leadin',
                  xAxis: phaseEndpoints.leadin.start,
                  itemStyle: {
                    color: theme === 'dark' ? 'rgba(0, 17, 255, 0.1)' : 'rgba(51, 62, 212, 0.35)',
                  },
                  label: {
                    show: true,
                    color: '#aaa',
                    fontWeight: 'bold',
                    fontSize: 12,
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
                  label: {
                    show: true,
                    color: '#aaa',
                    fontWeight: 'bold',
                    fontSize: 12,
                  },
                },
                { xAxis: phaseEndpoints.fixed.end },
              ],
            ],
          },
        },
      ],
      dataZoom: [{ type: 'inside', throttle: 50 }],
    };

    chartContent = <ReactECharts option={option} style={{ height: 300, width: '100%' }} />;
  }

  return (
    <div
      className={`${styles.chartCard} ${view === 'Deploying a new project' ? styles.compact : ''}`}
    >
      <div className={styles.title}>Dutch Auction Chart</div>
      {chartContent}
    </div>
  );
}
