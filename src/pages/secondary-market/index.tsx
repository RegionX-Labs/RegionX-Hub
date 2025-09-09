'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './secondary-market.module.scss';
import SecondaryMarketOverview from '@/components/SecondaryMarketOverview';
import AuctionPriceOverview from '@/components/Home/GeneralAnalytics/AuctionPriceOverview';
import HistoricalPricingChart from '@/components/HistoricalPricingChart';
import SecondaryMarketplaceTable from '@/components/SecondaryMarketplaceTable';
import { latestSaleRequested } from '@/coretime/saleInfo';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import WarningModal from '../secondary-market/WarningModal';

export default function SecondaryMarket() {
  const network = useUnit($network);

  const networkKnown = typeof network === 'string' && network.trim().length > 0;

  const isKusama = useMemo(
    () => networkKnown && network!.toLowerCase().includes('kusama'),
    [networkKnown, network]
  );

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    if (!networkKnown) return;
    setShowWarning(!isKusama);
  }, [networkKnown, isKusama]);

  const closeModal = useCallback(() => setShowWarning(false), []);

  return (
    <div className={styles.secondaryMarketPage}>
      <div className={styles.cardsRow} aria-hidden={showWarning}>
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

      <WarningModal open={showWarning} onClose={closeModal} title='Secondary Marketplace'>
        The Secondary Marketplace is currently <strong>available only on Kusama</strong>.
        <br />
        Once we finish testing on Kusama, it will be available on <strong>Polkadot</strong> as well.
      </WarningModal>
    </div>
  );
}
