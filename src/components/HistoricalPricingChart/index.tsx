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
  console.log('Sales returned:', sales);

  const result: SalePoint[] = [];

  for (const { saleCycle } of sales) {
    const purchaseQuery = `{
      purchases(
      filter: {
  saleCycle: { equalTo: ${saleCycle} }
}
,
        orderBy: HEIGHT_DESC,
        first: 1
      ) {
        nodes {
          price
          timestamp
        }
      }
    }`;

    const purchaseRes = await fetchGraphql(getNetworkCoretimeIndexer(network), purchaseQuery);
    if (purchaseRes.status !== 200) continue;

    const purchase = purchaseRes.data.purchases.nodes?.[0];
    console.log(`Sale cycle: ${saleCycle}`, purchase);

    if (
      !purchase ||
      !purchase.timestamp ||
      purchase.price === '0' ||
      parseInt(purchase.price) === 0
    )
      continue;

    const parsedPrice = parseInt(purchase.price);
    console.log(`Parsed price for cycle ${saleCycle}:`, parsedPrice);

    result.push({
      cycle: saleCycle,
      timestamp: new Date(Number(purchase.timestamp)).toLocaleDateString(),
      price: parsedPrice,
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
        console.log('Final result for chart:', result);
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
        <div style={{ padding: '20px', color: '#aaa' }}>No non-renewal purchases found.</div>
      ) : (
        <>
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
                formatter={(value: number) =>
                  `${toUnit(network, BigInt(value)).toFixed(2)} ${token}`
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
                name='Last Sale Price'
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
