import React from 'react';
import styles from './secondary-market.module.scss';
import SecondaryMarketplaceTable from '../../components/SecondaryMarketplaceTable';
import AuctionPriceOverview from '@/components/Home/GeneralAnalytics/AuctionPriceOverview';

export default function SecondaryMarket() {
  return (
    <div className={styles.secondaryMarketPage}>
      <div className={styles.AuctionPriceOverview}>
        {' '}
        <AuctionPriceOverview />
      </div>
      <SecondaryMarketplaceTable />
    </div>
  );
}
