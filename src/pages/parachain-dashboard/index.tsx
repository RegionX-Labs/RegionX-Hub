'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './dashboard.module.scss';
import { TableComponent } from '../../components/elements/TableComponent';
import { FaStar } from 'react-icons/fa';
import { useUnit } from 'effector-react';
import DashboardModal from '../../components/DashboardModal';
import { $connections, $network } from '@/api/connection';
import { ParaStateCard } from '@/components/ParaStateCard';
import { $parachains, parachainsRequested } from '@/parachains';
import { chainData } from '@/chaindata';
import { ParaState } from '@/components/ParaStateCard';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
} from '@/coretime/renewals';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import RegisterParaModal from '../parachain-dashboard/RegisterParaModal';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

const ParachainDashboard = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const network = useUnit($network);
  const connections = useUnit($connections);
  const parachains = useUnit($parachains);
  const potentialRenewals = useUnit($potentialRenewals);
  const saleInfo = useUnit($latestSaleInfo);

  const toggleWatchlist = (id: number) => {
    const watchlistKey = `watchlist_${network}`;
    setWatchlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(watchlistKey, JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const watchlistKey = `watchlist_${network}`;
    const saved = localStorage.getItem(watchlistKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setWatchlist(parsed);
      } catch {
        setWatchlist([]);
      }
    } else {
      setWatchlist([]);
    }
  }, [network]);

  useEffect(() => {
    parachainsRequested(network);
    potentialRenewalsRequested({ network, connections });
  }, [network, connections]);

  const filteredRows = useMemo(
    () =>
      (showWatchlist
        ? parachains.filter((p) => p.network === network && watchlist.includes(p.id))
        : parachains.filter((p) => p.network === network)) || [],
    [showWatchlist, parachains, watchlist, network]
  );

  const getRenewalStatus = (
    paraId: number
  ): { label: 'Renewed' | 'Needs Renewal'; color: string } => {
    if (!saleInfo) return { label: 'Renewed', color: '#8899A8' };

    const match = Array.from(potentialRenewals.entries()).find(
      ([key, record]: [RenewalKey, RenewalRecord]) =>
        (record.completion as any)?.value?.[0]?.assignment?.value === paraId &&
        saleInfo.regionBegin === key.when
    );

    return match
      ? { label: 'Needs Renewal', color: '#dc2626' }
      : { label: 'Renewed', color: '#15803d' };
  };

  const tableData: Record<string, TableData>[] = filteredRows.map((item) => {
    const meta = chainData[network]?.[item.id];
    const name = meta?.name || `Parachain ${item.id}`;
    const logo = meta?.logo;

    const renewal = getRenewalStatus(item.id);

    return {
      Id: { cellType: 'text', data: String(item.id) },
      Name: {
        cellType: 'jsx',
        data: (
          <div className={styles.parachainNameContainer}>
            {logo ? (
              <img src={logo} alt='' width={32} height={32} style={{ borderRadius: '100%' }} />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '100%',
                  backgroundColor: '#8899A8',
                }}
              />
            )}
            <p>{name}</p>
          </div>
        ),
        searchKey: name,
      },
      State: {
        cellType: 'jsx',
        data: <ParaStateCard state={item.state} />,
        searchKey: ParaState[item.state],
      },
      'Renewal status': {
        cellType: 'jsx',
        data: (
          <span className={styles.renewalStatus} style={{ backgroundColor: renewal.color }}>
            {renewal.label}
          </span>
        ),
        searchKey: renewal.label,
      },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <div className={styles.starIconContainer}>
            <FaStar
              className={`${styles.starIcon} ${watchlist.includes(item.id) ? styles.starActive : ''}`}
              onClick={() => toggleWatchlist(item.id)}
            />
          </div>
        ),
      },
    };
  });

  return (
    <div className={styles.parachain_dashboard_table}>
      <div className={styles.tableWrapper}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Parachain Dashboard</h2>
          <div className={styles.buttonContainer}>
            <button
              className={styles.customButton}
              onClick={() => setShowWatchlist(!showWatchlist)}
            >
              {showWatchlist ? 'Show All' : 'Watchlist'}
            </button>
            <button
              className={`${styles.customButton} ${styles.secondary}`}
              onClick={() => setIsModalOpen(true)}
            >
              Reserve New Para
            </button>
            <button
              className={`${styles.customButton} ${styles.secondary}`}
              onClick={() => setIsRegisterOpen(true)}
            >
              Register Para
            </button>
          </div>
        </div>

        <TableComponent
          key={`${network}-${showWatchlist ? 'watch' : 'all'}`}
          data={tableData}
          pageSize={8}
        />
      </div>

      <DashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <RegisterParaModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onConfirm={() => {}}
      />
    </div>
  );
};

export default ParachainDashboard;
