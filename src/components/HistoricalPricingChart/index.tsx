'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import styles from './HistoricalPricingChart.module.scss';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { getNetworkCoretimeIndexer } from '@/network';
import { fetchGraphql } from '@/graphql';
import { getTokenSymbol, toUnit } from '@/utils';
import { Network } from '@/types';

type SalePoint = {
  cycle: number;
  timestamp: string;
  price: number;
  average: number;
};

const fetchHistoricalSalePrices = async (network: Network): Promise<SalePoint[]> => {
  const query = `{
    sales(orderBy: SALE_CYCLE_DESC, first: 3) {
      nodes {
        saleCycle
      }
    }
  }`;

  const res = await fetchGraphql(getNetworkCoretimeIndexer(network), query);
  if (res.status !== 200) return [];

  const sales = res.data.sales.nodes as { saleCycle: number }[];
  const result: SalePoint[] = [];

  for (const { saleCycle } of sales) {
    const purchasesQuery = `{
      purchases(
        filter: { saleCycle: { equalTo: ${saleCycle} } },
        orderBy: HEIGHT_DESC,
        first: 1000
      ) {
        nodes {
          price
          timestamp
          purchaseType
        }
      }
    }`;

    const purchaseRes = await fetchGraphql(getNetworkCoretimeIndexer(network), purchasesQuery);
    if (purchaseRes.status !== 200) continue;

    const purchases = purchaseRes.data.purchases.nodes;

    if (!purchases || purchases.length === 0) continue;

    const validAllPrices = purchases
      .map((p: any) => parseInt(p.price))
      .filter((price: number) => !isNaN(price) && price > 0);

    if (validAllPrices.length === 0) continue;

    const latestPurchase = purchases[0];
    const latestPrice = parseInt(latestPurchase.price);
    const timestamp = new Date(Number(latestPurchase.timestamp)).toLocaleDateString();

    const bulkPurchases = purchases.filter((p: any) =>
      typeof p.purchaseType === 'string' ? p.purchaseType.toLowerCase().includes('bulk') : false
    );

    const bulkPrices = bulkPurchases
      .map((p: any) => parseInt(p.price))
      .filter((price: number) => !isNaN(price) && price > 0);

    const average =
      bulkPrices.length > 0
        ? bulkPrices.reduce((sum: number, price: number) => sum + price, 0) / bulkPrices.length
        : 0;

    result.push({
      cycle: saleCycle,
      timestamp,
      price: latestPrice,
      average,
    });
  }

  return result.reverse();
};

export default function HistoricalPricingChart() {
  const network = useUnit($network);
  const [data, setData] = useState<SalePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!network) return;
    setLoading(true);
    fetchHistoricalSalePrices(network)
      .then((result) => {
        setData(result);
      })
      .finally(() => setLoading(false));
  }, [network]);

  const token = getTokenSymbol(network);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Last 3 Sale Prices</span>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#aaa' }}>Loading data...</div>
      ) : data.length === 0 ? (
        <div style={{ padding: '20px', color: '#aaa' }}>No data found.</div>
      ) : (
        <ResponsiveContainer width='100%' height={315}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 50 }}>
            <CartesianGrid stroke='#2a2a2a' vertical={false} />
            <XAxis dataKey='timestamp' stroke='#888' tick={{ fontSize: 13, fill: '#888' }} />
            <YAxis
              domain={['auto', 'auto']}
              stroke='#888'
              tick={({ x, y, payload }) => (
                <text x={x - 5} y={y + 4} fontSize={13} fill='#888' textAnchor='end'>
                  {`${toUnit(network, BigInt(payload.value)).toFixed(2)} ${token}`}
                </text>
              )}
            />
            <Tooltip
              formatter={(value: number, name: string) =>
                `${toUnit(network, BigInt(Math.floor(value))).toFixed(2)} ${token}`
              }
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
            />
            <Legend
              verticalAlign='top'
              align='right'
              wrapperStyle={{ paddingBottom: 10, marginTop: -10, fontSize: 12 }}
            />
            <Line
              type='monotone'
              dataKey='price'
              stroke='#ffef2f'
              strokeWidth={1.5}
              name='Sellout price'
              dot
            />
            <Line
              type='monotone'
              dataKey='average'
              stroke='#00c6ff'
              strokeWidth={2}
              strokeDasharray='5 5'
              name='Average bulk price'
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
