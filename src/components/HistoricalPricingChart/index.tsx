'use client';

import React from 'react';
import styles from './HistoricalPricingChart.module.scss';

export default function HistoricalPricingChart() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Last 3 Sale Cycle Prices</span>
      </div>
      <div className={styles.placeholder}>
        Historical pricing data is currently unavailable. This feature requires an indexer service.
      </div>
    </div>
  );
}
