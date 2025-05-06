'use client';
import { useState, useEffect } from 'react';
import styles from './home.module.scss';
import Header from '@/components/Header';
import GeneralAnalytics from '@/components/Home/GeneralAnalytics';
import HomeDashboard from '@/components/Home/HomeDashboard';

export default function Home() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 800;

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.toggleButton}>
        {' '}
        {isMobile && (
          <button
            className={styles.AnalyticsButton}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        )}
      </div>

      {(!isMobile || showAnalytics) && <GeneralAnalytics />}
      <HomeDashboard />
    </div>
  );
}
