'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { ApexOptions } from 'apexcharts';
import styles from './DutchAuctionChart.module.scss';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const series = [
  {
    name: 'Price',
    data: [
      { x: 0, y: 100 },
      { x: 1, y: 70 },
      { x: 2, y: 70 },
      { x: 3, y: 65 },
      { x: 4, y: null },
      { x: 5, y: 49 },
    ],
  },
  {
    name: 'Projection Guide',
    data: [
      { x: 3, y: 65 },
      { x: 5, y: 49 },
    ],
  },
];

const options: ApexOptions = {
  chart: {
    type: 'line',
    height: 300,
    background: 'transparent',

    toolbar: {
      show: false,
      tools: {
        zoom: true,
        zoomin: true,
        zoomout: true,
        reset: true,
      },
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    width: [2, 2],
    curve: 'smooth',
    dashArray: [0, 7],
  },
  markers: {
    size: 0,
    strokeWidth: 0,
  },
  xaxis: {
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
    min: 0,
    max: 5,
  },
  yaxis: {
    tickAmount: 4,
    min: 0,
    max: 100,
    labels: {
      style: { colors: '#888' },
      formatter: (val: number) => `${val} DOT`,
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
        x: 0,
        borderColor: '#FFD700',
        label: {
          text: 'Starting Price',
          position: 'bottom',
          orientation: 'horizontal',
          offsetX: 8,
          offsetY: 10,
          style: {
            color: '#FFD700',
            background: 'transparent',
            fontSize: '12px',
          },
        },
      },
      {
        x: 3,
        borderColor: '#00FFA3',
        label: {
          text: 'Current Price',
          position: 'bottom',
          orientation: 'horizontal',
          offsetX: 8,
          offsetY: 10,
          style: {
            color: '#00FFA3',
            background: 'transparent',
            fontSize: '12px',
          },
        },
      },
      {
        x: 5,
        strokeDashArray: 4,
        borderColor: '#00FFA3',
        label: {
          text: 'Projected ending price',
          position: 'bottom',
          orientation: 'horizontal',
          offsetX: 8,
          offsetY: 10,
          style: {
            color: '#888',
            background: 'transparent',
            fontSize: '12px',
          },
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
  colors: ['#00FFA3', '#888'],
};

export default function DutchAuctionChart() {
  return (
    <div className={styles.chartCard}>
      <div className={styles.title}>Dutch Auction Chart</div>
      <ReactApexChart options={options} series={series} type='line' height={300} />
    </div>
  );
}
