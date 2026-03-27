'use client';

import { useEffect, useRef, useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './GeneralAnalytics.module.scss';
import BulkSaleSummary from './BulkSaleSummary';
import TopBuyerCard from './TopBuyerCard';
import UserBalance from './UserBalance';
import MarketCompare from './MarketComparison';
import { $network } from '@/api/connection';

export default function GeneralAnalytics() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'users' | 'market'>('all');
  const [network] = useUnit([$network]);

  const networkKnown = typeof network === 'string' && network.trim().length > 0;
  const isKusama = networkKnown && network!.toLowerCase().includes('kusama');
  const marketEnabled = isKusama;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const scrollDown = () => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    const scrollUp = () => el.scrollTo({ top: 0, behavior: 'smooth' });
    scrollDown();
    const timeout = setTimeout(scrollUp, 800);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!marketEnabled && activeTab === 'market') setActiveTab('all');
  }, [marketEnabled, activeTab]);

  return (
    <div className={styles.analyticsCard} ref={cardRef}>
      <div className={styles.header}>
        <h2>General Analytics</h2>
        <p>Overview of all statistics and user-related data</p>
      </div>

      <div className={styles.tabsWrapper}>
        <ul className={styles.tabs}>
          <li
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All stats
          </li>

          <li
            className={`${styles.tab} ${activeTab === 'sales' ? styles.active : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </li>

          <li
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </li>

          <li
            className={`${styles.tab} ${styles.marketTab} ${!marketEnabled ? styles.disabled : ''} ${activeTab === 'market' ? styles.active : ''}`}
            onClick={() => marketEnabled && setActiveTab('market')}
            aria-disabled={!marketEnabled}
            title={marketEnabled ? 'Marketplace analytics' : 'Market is available on Kusama only'}
          >
            Market
            {marketEnabled && activeTab !== 'market' && (
              <span className={styles.newBadge}>NEW</span>
            )}
          </li>
        </ul>
      </div>

      {activeTab === 'all' && (
        <>
          <BulkSaleSummary withMarketCompare />
        </>
      )}

      {activeTab === 'sales' && (
        <div className={styles.tabContent}>
          <BulkSaleSummary />
        </div>
      )}

      {activeTab === 'users' && (
        <div className={styles.tabContent}>
          <UserBalance />
          <TopBuyerCard />
        </div>
      )}

      {activeTab === 'market' && marketEnabled && (
        <div className={styles.tabContent}>
          <MarketCompare />
        </div>
      )}
    </div>
  );
}
