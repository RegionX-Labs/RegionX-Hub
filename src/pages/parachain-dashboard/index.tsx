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
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

type RenewalFilter = 'all' | 'renewed' | 'needs';
type StateFilter = 'all' | ParaState;

const stateLabel = (s: ParaState) => {
  return ParaState[s] ?? 'Unknown';
};

const ParachainDashboard = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [renewalFilter, setRenewalFilter] = useState<RenewalFilter>('all');

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

  const getRenewalStatus = (
    paraId: number
  ): { label: 'Renewed' | 'Needs Renewal'; color: string; key: 'renewed' | 'needs' } => {
    if (!saleInfo) return { label: 'Renewed', color: '#8899A8', key: 'renewed' };
    const match = Array.from(potentialRenewals.entries()).find(
      ([key, record]: [RenewalKey, RenewalRecord]) =>
        (record.completion as any)?.value?.[0]?.assignment?.value === paraId &&
        saleInfo.regionBegin === key.when
    );
    if (match) return { label: 'Needs Renewal', color: '#dc2626', key: 'needs' };
    return { label: 'Renewed', color: '#15803d', key: 'renewed' };
  };

  const baseRows = useMemo(
    () =>
      (showWatchlist
        ? parachains.filter((p) => p.network === network && watchlist.includes(p.id))
        : parachains.filter((p) => p.network === network)) || [],
    [showWatchlist, parachains, watchlist, network]
  );

  const counts = useMemo(() => {
    const byState = new Map<ParaState, number>();
    let renewed = 0;
    let needs = 0;
    for (const p of parachains.filter((x) => x.network === network)) {
      byState.set(p.state, (byState.get(p.state) ?? 0) + 1);
      const r = getRenewalStatus(p.id);
      if (r.key === 'renewed') renewed++;
      else needs++;
    }
    return {
      total: parachains.filter((x) => x.network === network).length,
      byState,
      renewed,
      needs,
    };
  }, [parachains, network, potentialRenewals, saleInfo]);

  const availableStates = useMemo(() => {
    const set = new Set<ParaState>();
    for (const p of parachains.filter((x) => x.network === network)) set.add(p.state);
    return Array.from(set.values()).sort((a, b) => a - b);
  }, [parachains, network]);

  const filteredRows = useMemo(() => {
    let rows = baseRows;
    if (stateFilter !== 'all') rows = rows.filter((r) => r.state === stateFilter);
    if (renewalFilter !== 'all')
      rows = rows.filter((r) => getRenewalStatus(r.id).key === renewalFilter);
    return rows;
  }, [baseRows, stateFilter, renewalFilter]);

  const stateOptions: SelectOption<StateFilter | 'all'>[] = useMemo(
    () => [
      { key: 'all', label: 'All states', value: 'all' as const },
      ...availableStates.map((s) => ({
        key: String(s),
        label: stateLabel(s),
        value: s as StateFilter,
      })),
    ],
    [availableStates]
  );

  const renewalOptions: SelectOption<RenewalFilter>[] = [
    { key: 'all', label: 'All', value: 'all' },
    { key: 'renewed', label: 'Renewed', value: 'renewed' },
    { key: 'needs', label: 'Needs Renewal', value: 'needs' },
  ];

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
              <img src={logo} alt='' width={28} height={28} style={{ borderRadius: '100%' }} />
            ) : (
              <div
                style={{ width: 28, height: 28, borderRadius: '100%', backgroundColor: '#8899A8' }}
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
        searchKey: stateLabel(item.state),
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
          <div className={styles.actionButtons}>
            <button
              className={`${styles.btn} ${styles.btnGhost} ${showWatchlist ? styles.btnOn : ''}`}
              onClick={() => setShowWatchlist(!showWatchlist)}
            >
              {showWatchlist ? 'Show All' : 'Watchlist'}
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => setIsModalOpen(true)}
            >
              Reserve Para
            </button>
            <button
              className={`${styles.btn} ${styles.btnAccent}`}
              onClick={() => setIsRegisterOpen(true)}
            >
              Register Para
            </button>
          </div>
        </div>

        <div className={styles.toolbarGrid}>
          <div className={styles.leftCol}>
            <div className={styles.selectWrap}>
              <Select
                options={stateOptions}
                selectedValue={stateFilter}
                onChange={(v) => setStateFilter(v as any)}
                variant='default'
                font={{ family: 'Inter', size: 14, lineHeight: '19px' }}
              />
            </div>
            <div className={styles.metricsBlock}>
              <div className={styles.chipSm}>Total: {counts.total}</div>
              <div className={styles.chipSm}>Renewed: {counts.renewed}</div>
              <div className={styles.chipSm}>Needs Renewal: {counts.needs}</div>
              {availableStates.map((s) => (
                <div key={s} className={styles.chipSm}>
                  {stateLabel(s)}: {counts.byState.get(s) ?? 0}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.segmentedOld} role='tablist' aria-label='Renewal filter'>
              <button
                type='button'
                role='tab'
                aria-selected={renewalFilter === 'all'}
                className={`${styles.segmentedBtn} ${renewalFilter === 'all' ? styles.active : ''}`}
                onClick={() => setRenewalFilter('all')}
              >
                All
              </button>
              <button
                type='button'
                role='tab'
                aria-selected={renewalFilter === 'renewed'}
                className={`${styles.segmentedBtn} ${renewalFilter === 'renewed' ? styles.active : ''}`}
                onClick={() => setRenewalFilter('renewed')}
              >
                Renewed
              </button>
              <button
                type='button'
                role='tab'
                aria-selected={renewalFilter === 'needs'}
                className={`${styles.segmentedBtn} ${renewalFilter === 'needs' ? styles.active : ''}`}
                onClick={() => setRenewalFilter('needs')}
              >
                Needs Renewal
              </button>
              <span
                className={styles.segmentedThumbOld}
                style={{
                  transform:
                    renewalFilter === 'all'
                      ? 'translateX(0)'
                      : renewalFilter === 'renewed'
                        ? 'translateX(calc(100% + 6px))'
                        : 'translateX(calc(200% + 12px))',
                }}
                aria-hidden='true'
              />
            </div>
          </div>
        </div>

        <TableComponent
          key={`${network}-${showWatchlist ? 'watch' : 'all'}-${stateFilter}-${renewalFilter}`}
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
