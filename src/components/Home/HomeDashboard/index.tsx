'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HomeDashboard.module.scss';
import RenewableCores from './RenewableCores';
import CoreComparison from './CoreComparison';
import DutchAuctionChart from './DutchAuctionChart';
import AuctionPhaseStatus from './AuctionPhaseStatus';
import CorePurchaseCard from './CorePurchaseCard';
import PurchaseHistoryTable from './PurchaseHistoryTable';
import DashboardHeader from './DashboardHeader';
import RenewalsOverview from './RenewalsOverview';
import CoreRemainingCard from '../HomeDashboard/CoreRemainingCard';
import RevenueGeneratedCard from '../HomeDashboard/RevenueGeneratedCard';

interface HomeDashboardProps {
  theme: 'light' | 'dark';
}

export default function HomeDashboard({ theme }: HomeDashboardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [selected, setSelected] = useState('Overview');

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      setScrolled(wrapper.scrollTop > 0);
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`${styles.dashboardWrapper} ${scrolled ? styles.scrolled : ''}`}
      ref={wrapperRef}
    >
      <DashboardHeader selected={selected} setSelected={setSelected} />
      <div className={styles.dashboard}>
        {selected === 'Overview' && (
          <>
            <RenewableCores view={selected} />
            <CoreComparison view={selected} />
            <CorePurchaseCard />
            <AuctionPhaseStatus view={selected} />
            <DutchAuctionChart theme={theme} />
            <RenewalsOverview />
            <CoreRemainingCard view={selected} />
            <RevenueGeneratedCard />
            <PurchaseHistoryTable />
          </>
        )}

        {selected === 'Deploying a new project' && (
          <>
            <CoreRemainingCard view={selected} />
            <CoreComparison view={selected} />
            <AuctionPhaseStatus view={selected} />
            <DutchAuctionChart theme={theme} view={selected} />
            <RenewableCores view={selected} />
            <PurchaseHistoryTable />
          </>
        )}
      </div>
    </div>
  );
}
