import React from 'react';
import styles from './SecondaryMarketOverview.module.scss';

export default function BestListingCard() {
  return (
    <div className={styles.card}>
      <div className={styles.title}>Average Price</div>
      <div className={styles.averagePrice}>SOL 65.740</div>

      <div className={styles.volumeLabel}>Volume of recent sales</div>
      <div className={styles.volumeValue}>DOT 43</div>

      <div className={styles.listingLabel}>Best Current Listing</div>
      <div className={styles.listingBox}>
        <div className={styles.listingId}>ID 234.1245</div>
        <div className={styles.listingPrice}>$29,340.20</div>
        <button className={styles.buyButton}>Buy Now</button>
      </div>
    </div>
  );
}
