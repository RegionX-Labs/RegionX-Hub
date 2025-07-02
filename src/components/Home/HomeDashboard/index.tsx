'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './HomeDashboard.module.scss';

import RenewableCores from './RenewableCores';
import CoreComparison from './CoreComparison';
import DutchAuctionChart from './DutchAuctionChart';
import AuctionPhaseStatus from './AuctionPhaseStatus';
import CorePurchaseCard from './CorePurchaseCard';
import PurchaseHistoryTable from './PurchaseHistoryTable';
import DashboardHeader from './DashboardHeader';
import RenewalsOverview from './RenewalsOverview';
import CoreRemainingCard from './CoreRemainingCard';
import RevenueGeneratedCard from './RevenueGeneratedCard';
import RenewalInfoCard from './RenewalInfoCard';
import UpcomingRenewalsTable from './UpcomingRenewalsTable';
interface HomeDashboardProps {
  theme: 'light' | 'dark';
}

const dashboards = [
  { name: 'Overview', enabled: true },
  { name: 'Deploying a new project', enabled: true },
  { name: 'Managing Existing Project', enabled: true },
  { name: 'Coretime Reseller', enabled: false },
];

export default function HomeDashboard({ theme }: HomeDashboardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const dashboardParam = searchParams.get('dashboard');
  const paraIdParam = searchParams.get('paraId');
  const network = searchParams.get('network') || 'polkadot';

  const [selectedParaId, setSelectedParaId] = useState<string | null>(null);

  const selected =
    dashboards.find((d) => d.name.toLowerCase().replace(/\s+/g, '-') === dashboardParam)?.name ||
    'Overview';

  const setSelected = (newSelection: string) => {
    const basePath = newSelection.toLowerCase().replace(/\s+/g, '-');
    const paraPart =
      basePath === 'managing-existing-project' && selectedParaId ? `&paraId=${selectedParaId}` : '';
    router.push(`?dashboard=${basePath}&network=${network}${paraPart}`, { scroll: false });
  };

  const hasSetInitial = useRef(false);
  useEffect(() => {
    if (!hasSetInitial.current && paraIdParam) {
      setSelectedParaId(paraIdParam);
      hasSetInitial.current = true;
    }
  }, [paraIdParam]);

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
            <UpcomingRenewalsTable />
            <PurchaseHistoryTable />
          </>
        )}

        {selected === 'Deploying a new project' && (
          <>
            <CoreRemainingCard view={selected} />
            <CorePurchaseCard view={selected} />
            <AuctionPhaseStatus view={selected} />
            <DutchAuctionChart theme={theme} view={selected} />
            <PurchaseHistoryTable />
          </>
        )}

        {selected === 'Managing Existing Project' && (
          <>
            <RenewalInfoCard
              initialParaId={selectedParaId ?? undefined}
              onSelectParaId={(id) => {
                setSelectedParaId(id);
                router.push(
                  `?dashboard=managing-existing-project&network=${network}&paraId=${id}`,
                  { scroll: false }
                );
              }}
            />

            <CoreComparison view={selected} />
            <AuctionPhaseStatus view={selected} />
            <DutchAuctionChart theme={theme} view={selected} />
          </>
        )}
      </div>
    </div>
  );
}
