'use client';

import styles from './MarketComparison.module.scss';

export default function MarketCompare() {
  const bestMarket = 390;
  const newCore = 610;

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const diff = newCore - bestMarket;
  const pct = (diff / bestMarket) * 100;

  let statusClass = styles.neutral;
  let statusText = `= same price`;

  if (diff > 0) {
    statusClass = styles.negative;
    statusText = `+${fmt(diff)} (${fmt(pct)}%) more`;
  } else if (diff < 0) {
    statusClass = styles.positive;
    statusText = `${fmt(Math.abs(diff))} (${fmt(Math.abs(pct))}%) cheaper`;
  }

  return (
    <div className={styles.metricBox}>
      <p className={styles.metricLabel}>Buy vs Market</p>
      <h3 className={styles.coretimeValue}>${fmt(bestMarket)}</h3>
      <p className={styles.subtitle}>Best marketplace deal</p>

      <div className={`${styles.highlightBox} ${statusClass}`}>
        <p>
          Buying new core costs <span>{statusText}</span> vs best deal
        </p>
      </div>
    </div>
  );
}
