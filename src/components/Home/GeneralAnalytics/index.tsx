import { useEffect, useRef } from 'react';
import styles from './GeneralAnalytics.module.scss';
import BulkSaleSummary from './BulkSaleSummary';

export default function GeneralAnalytics() {
  const cardRef = useRef<HTMLDivElement>(null);

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
          <li className={`${styles.tab} ${styles.active}`}>All stats</li>
          <li className={styles.tab}>Sales</li>
          <li className={styles.tab}>Users</li>
          <li className={styles.tab}>Market</li>
        </ul>
      </div>
      <BulkSaleSummary />
    </div>
  );
}
