'use client';
import { useEffect, useState } from 'react';
import styles from './home.module.scss';
import Header from '@/components/Header';
import GeneralAnalytics from '@/components/Home/GeneralAnalytics';
import HomeDashboard from '@/components/Home/HomeDashboard';

export default function Home() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      {isMobile && (
        <button
          className={styles.AnalyticsButton}
          onClick={() => setShowAnalytics((prev) => !prev)}
        >
          {showAnalytics ? 'Show Dashboard' : 'Show Analytics'}
        </button>
      )}
      {(!isMobile || showAnalytics) && <GeneralAnalytics />}
      {(!isMobile || !showAnalytics) && <HomeDashboard />}
    </div>
  );
}
