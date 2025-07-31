import React from 'react';
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

const data = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  primary: Math.floor(60 + Math.random() * 40),
  secondary: Math.floor(40 + Math.random() * 40),
}));

export default function HistoricalPricingChart() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Historical Pricing</span>
        <select className={styles.dropdown}>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>
      <ResponsiveContainer width='100%' height={315}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 50 }}>
          <CartesianGrid stroke='#2a2a2a' vertical={false} />
          <XAxis
            dataKey='day'
            stroke='#888'
            tick={{ fontSize: 13, fill: '#888' }}
            ticks={[1, 5, 10, 15, 20, 25, 30]}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 11.53375, 23.0675, 34.60125, 46.135, 57.66875, 69.2025, 80.73625, 92.27]}
            stroke='#888'
            tick={({ x, y, payload }) => (
              <text x={x - 5} y={y + 4} fontSize={13} fill='#888' textAnchor='end'>
                {`${payload.value} DOT`}
              </text>
            )}
            interval='preserveStartEnd'
          />

          <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
          <Legend
            verticalAlign='top'
            align='right'
            wrapperStyle={{ paddingBottom: 10, marginTop: -10, fontSize: 12 }}
          />
          <Line
            type='monotone'
            dataKey='primary'
            stroke='#ffef2f'
            strokeWidth={1.5}
            name='Primary Trends'
            dot={false}
          />
          <Line
            type='monotone'
            dataKey='secondary'
            stroke='#00d88d'
            strokeWidth={1.5}
            name='Secondary Trends'
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
