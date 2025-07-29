'use client';

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './DutchAuctionChart.module.scss';
import { useUnit } from 'effector-react';

import {
  $latestSaleInfo,
  $phaseEndpoints,
  fetchSelloutPrice,
  SalePhase,
} from '@/coretime/saleInfo';
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

  if (
    !phaseEndpoints ||
    !phaseEndpoints.leadin ||
    !phaseEndpoints.fixed ||
    !phaseEndpoints.interlude
  ) {
    return null;
  }

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
      value: toUnit(
        network,
        saleInfo ? BigInt(getCorePriceAt(saleInfo.saleStart, saleInfo, network)) : BigInt(0)
      ),
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

  const now = Date.now();

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) =>
        `${new Date(params[0].data[0]).toLocaleDateString()}<br/>Price: ${params[0].data[1]} ${getTokenSymbol(network)}`,
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: theme === 'dark' ? '#888' : '#444' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      name: getTokenSymbol(network),
      axisLine: { lineStyle: { color: theme === 'dark' ? '#888' : '#444' } },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: theme === 'dark' ? '#444' : '#ccc',
        },
      },
    },
    series: [
      {
        name: 'Core Price',
        type: 'line',
        smooth: false,
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#00ff9d',
        },
        itemStyle: {
          color: '#00ffaa',
        },
        data: points.map((p) => [p.timestamp, p.value]),
        markArea: {
          silent: true,
          itemStyle: { opacity: 0.25 },
          data: [
            [
              {
                name: 'Interlude',
                xAxis: phaseEndpoints.interlude.start,
                itemStyle: {
                  color: theme === 'dark' ? 'rgba(0, 255, 162, 0.49)' : 'rgba(0, 255, 162, 0.49)',
                },
                label: {
                  show: true,
                  color: '#aaa',
                  fontWeight: 'bold',
                  fontSize: 12,
                  textBorderWidth: 0,
                },
              },
              { xAxis: phaseEndpoints.interlude.end },
            ],
            [
              {
                name: 'Leadin',
                xAxis: phaseEndpoints.leadin.start,
                itemStyle: {
                  color: theme === 'dark' ? 'rgba(0, 17, 255, 0.1)' : 'rgba(0, 17, 255, 0.1)',
                },
                label: {
                  show: true,
                  color: '#aaa',
                  fontWeight: 'bold',
                  fontSize: 12,
                  textBorderWidth: 0,
                },
              },
              { xAxis: phaseEndpoints.leadin.end },
            ],
            [
              {
                name: 'Fixed Price',
                xAxis: phaseEndpoints.fixed.start,
                itemStyle: {
                  color: theme === 'dark' ? 'rgba(160, 0, 0, 0.05)' : 'rgba(160, 0, 0, 0.32)',
                },
                label: {
                  show: true,
                  color: '#aaa',
                  fontWeight: 'bold',
                  fontSize: 12,
                  textBorderWidth: 0,
                },
              },
              { xAxis: phaseEndpoints.fixed.end },
            ],
          ],
        },
      },
      {
        name: 'Tooltip Tracker',
        type: 'line',
        showSymbol: false,
        lineStyle: { opacity: 0 }, // no visible line
        itemStyle: { opacity: 0 }, // no dots
        emphasis: { disabled: true },
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
                  return saleInfo ? BigInt(getCorePriceAt(ts, saleInfo, network)) : BigInt(0);
                }
                return BigInt(saleInfo?.endPrice || '0');
              })()
            );
            days.push([ts, price]);
          }
          return days;
        })(),
      },
    ],

    dataZoom: [{ type: 'inside', throttle: 50 }, { type: 'slider' }],
    graphic: {
      elements: [
        {
          type: 'line',
          shape: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: '100%',
          },
          style: {
            stroke: theme === 'dark' ? '#3B82F6' : '#1C64F2',
            lineDash: [4, 4],
          },
          position: [now, 0],
          silent: true,
        },
      ],
    },
  };

  return (
    <div
      className={`${styles.chartCard} ${view === 'Deploying a new project' ? styles.compact : ''}`}
    >
      {/* <div className={styles.backgroundLabels}>
        <span className={styles.interlude}>Interlude</span>
        <span className={styles.leadin}>Leadin</span>
        <span className={styles.fixed}>Fixed Price</span>
      </div> */}
      <div className={styles.title}>Dutch Auction Chart</div>
      <ReactECharts option={option} style={{ height: 300, width: '100%' }} />
    </div>
  );
}
