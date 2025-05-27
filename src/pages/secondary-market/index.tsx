import React from 'react';
import styles from './secondary-market.module.scss';
import SecondaryMarketplaceTable from '../../components/SecondaryMarketplaceTable';
import AuctionPriceOverview from '@/components/Home/GeneralAnalytics/AuctionPriceOverview';
import SecondaryMarketOverview from '@/components/SecondaryMarketOverview';

export default function SecondaryMarket() {
  return (
    <div className={styles.secondaryMarketPage}>
      <div className={styles.cardsRow}>
        <div className={styles.SecondaryMarketOverview}>
          <SecondaryMarketOverview />
        </div>
        <div className={styles.AuctionPriceOverview}>
          <AuctionPriceOverview />
        </div>
        <div className={styles.PricingChartCard}>
          <AuctionPriceOverview />
        </div>
      </div>
      <SecondaryMarketplaceTable />
    </div>
  );
}
