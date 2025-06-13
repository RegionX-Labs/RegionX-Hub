import { useEffect, useRef, useState } from 'react';
import styles from './GeneralAnalytics.module.scss';
import BulkSaleSummary from './BulkSaleSummary';
import TopBuyerCard from './TopBuyerCard';
import UserBalance from './UserBalance';

export default function GeneralAnalytics() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'users'>('all');

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const scrollDown = () => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    };

    const scrollUp = () => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    };

    scrollDown();
    const timeout = setTimeout(scrollUp, 800);

    return () => clearTimeout(timeout);
  }, []);

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
          <li className={`${styles.tab} ${styles.disabled}`}>Market</li>
        </ul>
      </div>

      {activeTab === 'all' && <BulkSaleSummary />}

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
    </div>
  );
}
