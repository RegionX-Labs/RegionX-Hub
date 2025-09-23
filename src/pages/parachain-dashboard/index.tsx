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
import { $selectedAccount } from '@/wallet';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { encodeAddress } from '@polkadot/util-crypto';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

type RenewalFilter = 'all' | 'renewed' | 'needs';
type StateFilter = 'all' | ParaState;

const stateLabel = (s: ParaState) => ParaState[s] ?? 'Unknown';

const ParachainDashboard = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showMine, setShowMine] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [renewalFilter, setRenewalFilter] = useState<RenewalFilter>('all');
  const [managedIds, setManagedIds] = useState<Set<number>>(new Set());

  const network = useUnit($network);
  const connections = useUnit($connections);
  const parachains = useUnit($parachains);
  const potentialRenewals = useUnit($potentialRenewals);
  const saleInfo = useUnit($latestSaleInfo);
  const selectedAccount = useUnit($selectedAccount);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const addr = selectedAccount?.address;
      if (!addr) {
        if (!cancelled) setManagedIds(new Set());
        return;
      }
      const ids = getNetworkChainIds(network);
      const meta = getNetworkMetadata(network);
      const relayConn = ids ? connections[ids.relayChain] : null;
      if (!ids || !meta || !relayConn?.client) {
        if (!cancelled) setManagedIds(new Set());
        return;
      }
      try {
        const api = relayConn.client.getTypedApi(meta.relayChain);
        const me = encodeAddress(addr, 42);
        const entries = await api.query.Registrar.Paras.getEntries();
        const mine = new Set<number>();
        for (const e of entries) {
          const id = e.keyArgs[0];
          const manager = encodeAddress(e.value.manager, 42);
          if (manager === me) mine.add(id);
        }
        if (!cancelled) setManagedIds(mine);
      } catch {
        if (!cancelled) setManagedIds(new Set());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [network, connections, selectedAccount?.address]);

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

  const baseRows = useMemo(() => {
    const rows =
      (showWatchlist
        ? parachains.filter((p) => p.network === network && watchlist.includes(p.id))
        : parachains.filter((p) => p.network === network)) || [];
    if (showMine && selectedAccount?.address) {
      return rows.filter((r) => managedIds.has(r.id));
    }
    return rows;
  }, [
    showWatchlist,
    showMine,
    parachains,
    watchlist,
    network,
    managedIds,
    selectedAccount?.address,
  ]);

  const counts = useMemo(() => {
    const byState = new Map<ParaState, number>();
    let renewed = 0;
    let needs = 0;
    const rows = parachains.filter((x) => x.network === network);
    for (const p of rows) {
      byState.set(p.state, (byState.get(p.state) ?? 0) + 1);
      const r = getRenewalStatus(p.id);
      if (r.key === 'renewed') renewed++;
      else needs++;
    }
    return { total: rows.length, byState, renewed, needs };
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
                variant='secondary'
                font={{ family: 'Inter', size: 14, lineHeight: '19px' }}
              />
            </div>
          </div>

          <div className={styles.rightCol}>
            <div
              className={`${styles.segmentedOld} ${styles.cols4}`}
              role='tablist'
              aria-label='Filters'
            >
              <button
                type='button'
                role='tab'
                aria-selected={!showMine && renewalFilter === 'all'}
                className={`${styles.segmentedBtn} ${!showMine && renewalFilter === 'all' ? styles.active : ''}`}
                onClick={() => {
                  setShowMine(false);
                  setRenewalFilter('all');
                }}
              >
                All
              </button>
              <button
                type='button'
                role='tab'
                aria-selected={showMine}
                disabled={!selectedAccount?.address}
                title={selectedAccount?.address ? '' : 'Connect an account'}
                className={`${styles.segmentedBtn} ${showMine ? styles.active : ''}`}
                onClick={() => setShowMine(true)}
              >
                My Projects
              </button>
              <button
                type='button'
                role='tab'
                aria-selected={!showMine && renewalFilter === 'renewed'}
                className={`${styles.segmentedBtn} ${!showMine && renewalFilter === 'renewed' ? styles.active : ''}`}
                onClick={() => {
                  setShowMine(false);
                  setRenewalFilter('renewed');
                }}
              >
                Renewed
              </button>
              <button
                type='button'
                role='tab'
                aria-selected={!showMine && renewalFilter === 'needs'}
                className={`${styles.segmentedBtn} ${!showMine && renewalFilter === 'needs' ? styles.active : ''}`}
                onClick={() => {
                  setShowMine(false);
                  setRenewalFilter('needs');
                }}
              >
                Needs Renewal
              </button>
              <span
                className={styles.segmentedThumbOld}
                style={{
                  transform: showMine
                    ? 'translateX(calc(100% + 6px))'
                    : renewalFilter === 'all'
                      ? 'translateX(0)'
                      : renewalFilter === 'renewed'
                        ? 'translateX(calc(200% + 12px))'
                        : 'translateX(calc(300% + 18px))',
                  width: 'calc(25% - 6px)',
                }}
                aria-hidden='true'
              />
            </div>
          </div>
        </div>

        {/* LABELS BELOW SEARCH */}
        <div className={styles.metricsBlock}>
          <div className={styles.chipSm}>Total: {counts.total}</div>
          <div className={styles.chipSm}>Renewed: {counts.renewed}</div>
          <div className={styles.chipSm}>Needs Renewal: {counts.needs}</div>
          {availableStates.map((s) => (
            <div key={s} className={styles.chipSm}>
              {stateLabel(s)}: {counts.byState.get(s) ?? 0}
            </div>
          ))}
          {showMine && selectedAccount?.address && (
            <div className={styles.chipSm}>Showing: My Projects</div>
          )}
          {showWatchlist && <div className={styles.chipSm}>Filter: Watchlist</div>}
        </div>

        <TableComponent
          key={`${network}-${showWatchlist ? 'watch' : 'all'}-${showMine ? 'mine' : 'any'}-${stateFilter}-${renewalFilter}`}
          data={tableData}
          pageSize={8}
        />
      </div>

      <DashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <RegisterParaModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
};

export default ParachainDashboard;
