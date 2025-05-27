import React, { useEffect } from 'react';
import styles from './secondary-market.module.scss';
import SecondaryMarketplaceTable from '../../components/SecondaryMarketplaceTable';
import AuctionPriceOverview from '@/components/Home/GeneralAnalytics/AuctionPriceOverview';
import SecondaryMarketOverview from '@/components/SecondaryMarketOverview';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { latestSaleRequested } from '@/coretime/saleInfo';

export default function SecondaryMarket() {
  const network = useUnit($network);

  useEffect(() => {
    if (network) latestSaleRequested(network);
  }, [network]);

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
