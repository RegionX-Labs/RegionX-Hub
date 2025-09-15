'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './HistoricalPricingChart.module.scss';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { getNetworkCoretimeIndexer } from '@/network';
import { fetchGraphql } from '@/graphql';
import { getTokenSymbol, toUnit } from '@/utils';
import { Network } from '@/types';

type SalePoint = {
  cycle: number;
  timestamp: number;
  price: number;
  average: number;
};

const fetchHistoricalSalePrices = async (network: Network): Promise<SalePoint[]> => {
  const query = `{
    sales(orderBy: SALE_CYCLE_DESC, first: 3) {
      nodes { saleCycle }
    }
  }`;

  const res = await fetchGraphql(getNetworkCoretimeIndexer(network), query);
  if (res.status !== 200 || !res.data?.sales?.nodes?.length) return [];

  const sales = res.data.sales.nodes as { saleCycle: number }[];

  const perSale = await Promise.all(
    sales.map(async ({ saleCycle }) => {
      const purchasesQuery = `{
        purchases(
          filter: { saleCycle: { equalTo: ${saleCycle} } }
          orderBy: HEIGHT_DESC
          first: 1000
        ) {
          nodes { price timestamp purchaseType }
        }
      }`;

      const purchaseRes = await fetchGraphql(getNetworkCoretimeIndexer(network), purchasesQuery);
      if (purchaseRes.status !== 200) return null;

      const purchases = purchaseRes.data?.purchases?.nodes ?? [];
      if (!purchases.length) return null;

      const validAll = purchases
        .map((p: any) => Number.parseInt(p.price))
        .filter((n: number) => Number.isFinite(n) && n > 0);

      if (!validAll.length) return null;

      const latest = purchases[0];
      const latestPrice = Number.parseInt(latest.price);
      const tsMs = Number(latest.timestamp);

      const bulkPrices = purchases
        .filter((p: any) =>
          typeof p.purchaseType === 'string' ? p.purchaseType.toLowerCase().includes('bulk') : false
        )
        .map((p: any) => Number.parseInt(p.price))
        .filter((n: number) => Number.isFinite(n) && n > 0);

      const average =
        bulkPrices.length > 0
          ? Math.floor(bulkPrices.reduce((a: number, b: number) => a + b, 0) / bulkPrices.length)
          : 0;

      const point: SalePoint = {
        cycle: saleCycle,
        timestamp: tsMs,
        price: latestPrice,
        average,
      };

      return point;
    })
  );

  const cleaned = perSale.filter((x): x is SalePoint => !!x);
  return cleaned.reverse();
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
      ...data.map((d) => Number(fmt(d.average))),
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
        axisPointer: {
          type: 'cross',
          label: {
            show: true,
            formatter: (p: any) => {
              if (p.axisDimension === 'y') {
                return `${Number(p.value).toFixed(3)} ${token}`;
              }
              return String(p.value);
            },
          },
        },
        formatter: (params: any[]) => {
          const p = params[0];
          const d = data[p?.dataIndex ?? 0];
          const date = new Date(d.timestamp);
          const dateTime =
            date.toLocaleDateString() +
            ' ' +
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const price = Number(toUnit(network, BigInt(d.price))).toLocaleString(undefined, {
            maximumFractionDigits: 6,
          });
          const avg = Number(toUnit(network, BigInt(d.average))).toLocaleString(undefined, {
            maximumFractionDigits: 6,
          });
          return [
            `Sale cycle: ${d.cycle}`,
            dateTime,
            `Sellout price: <b>${price} ${token}</b>`,
            `Average bulk price: <b>${avg} ${token}</b>`,
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
        data: data.map((d) => `Cycle ${d.cycle}\n${new Date(d.timestamp).toLocaleDateString()}`),
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
          name: 'Average bulk price',
          type: 'line',
          smooth: false,
          showSymbol: false,
          lineStyle: { width: 2, type: 'dashed', color: '#0cc184' },
          itemStyle: { color: '#0cc184' },
          data: data.map((d) => Number(fmt(d.average))),
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
