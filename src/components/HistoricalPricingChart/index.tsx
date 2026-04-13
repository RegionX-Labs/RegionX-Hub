'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './HistoricalPricingChart.module.scss';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { getTokenSymbol, toUnit } from '@/utils';
import { Network } from '@/types';
import { subscanFetch } from '@/subscan';

type SubscanSaleData = {
  sales_cycle: number;
  start_price: string;
  price: string;
  sellout_price: string;
  cores_sold: number;
  cores_offered: number;
};

type SalePoint = {
  cycle: number;
  price: number;
  startPrice: number;
};

const fetchHistoricalSalePrices = async (network: Network): Promise<SalePoint[]> => {
  // Get the latest sale to know the current cycle.
  const latest = await subscanFetch<SubscanSaleData>(network, '/api/scan/broker/sale');
  if (!latest?.sales_cycle) return [];

  const currentCycle = latest.sales_cycle;
  const cyclesToFetch = Math.min(currentCycle, 3);

  // Fetch the last 3 cycles sequentially to respect rate limits.
  const points: SalePoint[] = [];
  for (let i = cyclesToFetch - 1; i >= 0; i--) {
    const cycle = currentCycle - i;
    const data = await subscanFetch<SubscanSaleData>(network, '/api/scan/broker/sale', {
      sales_cycle: cycle,
    });
    if (data && data.sales_cycle > 0) {
      points.push({
        cycle: data.sales_cycle,
        price: parseInt(data.sellout_price || data.price || '0'),
        startPrice: parseInt(data.start_price || '0'),
      });
    }
  }

  return points;
};

export default function HistoricalPricingChart() {
  const network = useUnit($network);
  const [data, setData] = useState<SalePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getTokenSymbol(network);

  useEffect(() => {
    if (!network) return;
    setLoading(true);
    fetchHistoricalSalePrices(network)
      .then(setData)
      .finally(() => setLoading(false));
  }, [network]);

  const option = useMemo(() => {
    if (!network || !data.length) return null;

    const fmt = (raw: number) => toUnit(network, BigInt(raw));
    const yVals = [
      ...data.map((d) => Number(fmt(d.price))),
      ...data.map((d) => Number(fmt(d.startPrice))),
    ];
    const max = Math.max(...yVals, 0);
    const tickCount = 6;
    const step = max > 0 ? max / tickCount : 1;
    const yMax = Math.max(max, step);

    return {
      backgroundColor: 'transparent',
      grid: { left: 70, right: 40, top: 40, bottom: 50 },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any[]) => {
          const p = params[0];
          const d = data[p?.dataIndex ?? 0];
          const price = Number(toUnit(network, BigInt(d.price))).toLocaleString(undefined, {
            maximumFractionDigits: 6,
          });
          const startP = Number(toUnit(network, BigInt(d.startPrice))).toLocaleString(undefined, {
            maximumFractionDigits: 6,
          });
          return [
            `Sale cycle: ${d.cycle}`,
            `Sellout price: <b>${price} ${token}</b>`,
            `Start price: <b>${startP} ${token}</b>`,
          ].join('<br/>');
        },
      },

      legend: {
        top: 0,
        right: 10,
        textStyle: { color: '#aaa', fontSize: 12 },
        icon: 'roundRect',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((d) => `Cycle ${d.cycle}`),
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: {
          color: '#aaa',
          fontSize: 10,
          hideOverlap: true,
        },
        axisTick: { alignWithLabel: true },
      },

      yAxis: {
        type: 'value',
        min: 0,
        max: yMax,
        interval: step,
        axisLine: { lineStyle: { color: '#666' } },
        axisLabel: {
          color: '#aaa',
          fontSize: 10,
          formatter: (val: number) => `${val.toFixed(2)} ${token}`,
        },
        splitLine: { lineStyle: { type: 'dashed', color: 'rgba(136,136,136,0.25)' } },
      },
      series: [
        {
          name: 'Sellout price',
          type: 'line',
          smooth: false,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 2, color: '#eab308' },
          itemStyle: { color: '#eab308' },
          data: data.map((d) => Number(fmt(d.price))),
        },
        {
          name: 'Start price',
          type: 'line',
          smooth: false,
          showSymbol: false,
          lineStyle: { width: 2, type: 'dashed', color: '#0cc184' },
          itemStyle: { color: '#0cc184' },
          data: data.map((d) => Number(fmt(d.startPrice))),
        },
      ],
    };
  }, [data, network, token]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Last 3 Sale Cycle Prices</span>
      </div>

      {loading ? (
        <div className={styles.placeholder}>Loading data...</div>
      ) : !data.length || !option ? (
        <div className={styles.placeholder}>No data found.</div>
      ) : (
        <ReactECharts option={option} style={{ height: 330, width: '100%' }} />
      )}
    </div>
  );
}
