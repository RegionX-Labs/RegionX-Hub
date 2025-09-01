'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './HomeDashboard.module.scss';

import UrgentRenewals from './UrgentRenewals';
import CoreComparison from './CoreComparison';
import DutchAuctionChart from './DutchAuctionChart';
import AuctionPhaseStatus from './AuctionPhaseStatus';
import CorePurchaseCard from './CorePurchaseCard';
import PurchaseHistoryTable from './PurchaseHistoryTable';
import DashboardHeader from './DashboardHeader';
import RenewalsOverview from './RenewalsOverview';
import CoreRemainingCard from './CoreRemainingCard';
import RevenueGeneratedCard from './RevenueGeneratedCard';
import ParachainInfoCard from './ParachainInfoCard';
import UpcomingRenewalsTable from './UpcomingRenewalsTable';
import SpecificDashboardModal from './DashboardHeader/SpecificDashboardModal';
import OwnedRegionsTable from './OwnedRegionsTable';
import AutoRenewalTable from './AutoRenewalTable';
import ProjectAssignedCoresTable from './ProjectAssignedCoresTable';

interface HomeDashboardProps {
  theme: 'light' | 'dark';
}

const dashboards = [
  { name: 'Overview', key: 'overview', enabled: true },
  { name: 'Deploying a new project', key: 'deploying-new-project', enabled: true },
  { name: 'Managing Existing Project', key: 'managing-existing-project', enabled: true },
  { name: 'Coretime Reseller', key: 'coretime-reseller', enabled: false },
];

export default function HomeDashboard({ theme }: HomeDashboardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showInitialModal, setShowInitialModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const dashboardParam = searchParams.get('dashboard');
  const paraIdParam = searchParams.get('paraId');
  const network = searchParams.get('network') || 'polkadot';

  const [selectedParaId, setSelectedParaId] = useState<string | null>(null);

  const selected =
    dashboards.find((d) => d.key === dashboardParam)?.name ||
    dashboards.find((d) => d.key === localStorage.getItem('dashboardSelection'))?.name ||
    'Overview';

  const setSelected = (newSelection: string) => {
    const entry = dashboards.find((d) => d.name === newSelection);
    const basePath = entry?.key || 'overview';
    const paraPart =
      basePath === 'managing-existing-project' && selectedParaId ? `&paraId=${selectedParaId}` : '';
    localStorage.setItem('dashboardSelection', basePath);
    router.push(`?dashboard=${basePath}&network=${network}${paraPart}`, { scroll: false });
  };

  useEffect(() => {
    const stored = localStorage.getItem('dashboardSelection');
    if (!stored) {
      setShowInitialModal(true);
    }
  }, []);

  const handleDashboardSelect = (key: string) => {
    localStorage.setItem('dashboardSelection', key);
    setShowInitialModal(false);
    router.push(`?dashboard=${key}&network=${network}`, { scroll: false });
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
      {showInitialModal && (
        <SpecificDashboardModal
          onSelect={handleDashboardSelect}
          onClose={() => setShowInitialModal(false)}
        />
      )}

      <DashboardHeader selected={selected} setSelected={setSelected} />

      <div className={styles.dashboard}>
        {selected === 'Overview' && (
          <>
            <UrgentRenewals view={selected} />
            <CoreComparison view={selected} />
            <CorePurchaseCard />
            <AuctionPhaseStatus view={selected} />
            <DutchAuctionChart theme={theme} />
            <RenewalsOverview />
            <CoreRemainingCard view={selected} />
            <RevenueGeneratedCard />
            <AutoRenewalTable />
            <OwnedRegionsTable />
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
            <OwnedRegionsTable />
            <PurchaseHistoryTable />
          </>
        )}

        {selected === 'Managing Existing Project' && (
          <>
            <ParachainInfoCard
              initialParaId={selectedParaId ?? undefined}
              onSelectParaId={(id) => {
                setSelectedParaId(id);
                const params = new URLSearchParams(window.location.search);
                params.set('paraId', id);
                router.push(`?${params.toString()}`, { scroll: false });
              }}
            />
            <CoreComparison view={selected} />
            <AuctionPhaseStatus view={selected} />
            <DutchAuctionChart theme={theme} view={selected} />
            <ProjectAssignedCoresTable taskParaId={selectedParaId ?? null} />
            <AutoRenewalTable />
            <OwnedRegionsTable />
          </>
        )}
      </div>
    </div>
  );
}
