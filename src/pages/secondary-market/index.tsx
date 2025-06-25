import React, { useEffect } from 'react';
import styles from './secondary-market.module.scss';
import SecondaryMarketOverview from '@/components/SecondaryMarketOverview';
import AuctionPriceOverview from '@/components/Home/GeneralAnalytics/AuctionPriceOverview';
import HistoricalPricingChart from '@/components/HistoricalPricingChart';
import SecondaryMarketplaceTable from '@/components/SecondaryMarketplaceTable';
import { latestSaleRequested } from '@/coretime/saleInfo';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';

export default function SecondaryMarket() {
  const network = useUnit($network);

  useEffect(() => {
    // Needed for auction price overview
    latestSaleRequested(network);
  })

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
          <HistoricalPricingChart />
        </div>
      </div>
      <SecondaryMarketplaceTable />
    </div>
  );
}
