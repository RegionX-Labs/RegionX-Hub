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

export default function SecondaryMarket() {
  const network = useUnit($network);

  const isKusama = useMemo(
    () =>
      String(network ?? '')
        .toLowerCase()
        .includes('kusama'),
    [network]
  );

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    if (!isKusama) setShowWarning(true);
  }, [isKusama]);

  const closeModal = useCallback(() => setShowWarning(false), []);

  useEffect(() => {
    if (!showWarning) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWarning, closeModal]);

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

      {showWarning && (
        <div
          className={styles.netWarnOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={styles.netWarnModal}
            role='dialog'
            aria-modal='true'
            aria-labelledby='sec-market-warning-title'
          >
            <div className={styles.netWarnHeader}>
              <h3 id='sec-market-warning-title' className={styles.netWarnTitle}>
                Secondary Marketplace
              </h3>
              <button className={styles.netWarnClose} aria-label='Close' onClick={closeModal}>
                ×
              </button>
            </div>

            <div className={styles.netWarnBody}>
              The Secondary Marketplace is currently <strong>available only on Kusama</strong>.
              <br />
              Once we finish testing on Kusama, it will be available on <strong>Polkadot</strong> as
              well.
            </div>

            <div className={styles.netWarnFooter}>
              <button className={styles.btnGhost} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
