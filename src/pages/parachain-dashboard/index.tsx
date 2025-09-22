'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { BaseChainInfo } from '@/chaindata/types';
import { $selectedAccount } from '@/wallet';
import { encodeAddress } from '@polkadot/util-crypto';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import type { Network } from '@/types';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

type ManagementInfo = {
  manager?: string;
  owner?: string;
  contact?: string;
  accountManager?: string;
};

type RenewalFilter = 'all' | 'renewed' | 'needs';
type StateFilter = 'all' | ParaState;
type ManagerFilter = 'all' | 'mine';

const stateLabel = (s: ParaState) => ParaState[s] ?? 'Unknown';

const normalize = (addr?: string | null, fmt = 42) => {
  if (!addr) return '';
  try {
    return encodeAddress(addr, fmt);
  } catch {
    return '';
  }
};

type RegistrarInfo = { manager?: string; locked: boolean };
type RegistrarMap = Map<number, RegistrarInfo>;

type NetworkKey = keyof typeof chainData;

function useRegistrarManagers(network: Network, connections: any, paraIds: number[]): RegistrarMap {
  const [map, setMap] = useState<RegistrarMap>(new Map());
  const cacheRef = useRef<RegistrarMap>(new Map());
  const inflightRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = getNetworkChainIds(network);
      const meta = getNetworkMetadata(network);
      if (!ids || !meta) return;
      const relayConn = connections[ids.relayChain];
      if (!relayConn?.client) return;
      const api = relayConn.client.getTypedApi(meta.relayChain);
      const need = paraIds.filter(
        (id) => !cacheRef.current.has(id) && !inflightRef.current.has(id)
      );
      if (need.length === 0) {
        setMap(new Map(cacheRef.current));
        return;
      }
      const batch = [...need];
      for (const id of batch) inflightRef.current.add(id);
      try {
        const results = await Promise.all(
          batch.map(async (id) => {
            try {
              const reg = await api.query.Registrar.Paras.getValue(Number(id));
              const info: RegistrarInfo = reg
                ? { manager: reg.manager ? String(reg.manager) : undefined, locked: !!reg.locked }
                : { manager: undefined, locked: false };
              return [id, info] as const;
            } catch {
              return [id, { manager: undefined, locked: false }] as const;
            }
          })
        );
        if (cancelled) return;
        const next = new Map(cacheRef.current);
        for (const [id, info] of results) {
          next.set(id, info);
          inflightRef.current.delete(id);
        }
        cacheRef.current = next;
        setMap(new Map(next));
      } catch {
        for (const id of batch) inflightRef.current.delete(id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [network, connections, paraIds.join('|')]);

  return map;
}

const ParachainDashboard = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [renewalFilter, setRenewalFilter] = useState<RenewalFilter>('all');
  const [managerFilter, setManagerFilter] = useState<ManagerFilter>('all');

  const network = useUnit($network) as Network;
  const networkKey = network as unknown as NetworkKey;
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

  const baseRows = useMemo(
    () =>
      (showWatchlist
        ? parachains.filter((p) => p.network === network && watchlist.includes(p.id))
        : parachains.filter((p) => p.network === network)) || [],
    [showWatchlist, parachains, watchlist, network]
  );

  const paraIds = useMemo(() => baseRows.map((p) => p.id), [baseRows]);
  const registrarMap = useRegistrarManagers(network, connections, paraIds);

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

  const pickManager = (p: { id: number; accountManager?: string }) => {
    const reg = registrarMap.get(p.id);
    const fromRegistrar = reg?.manager ? normalize(reg.manager, 42) : '';
    if (fromRegistrar) return fromRegistrar;
    const meta =
      (chainData[networkKey]?.[p.id] as (BaseChainInfo & ManagementInfo) | undefined) ?? undefined;
    const candidates = [p.accountManager, meta?.manager, meta?.owner, meta?.contact].filter(
      Boolean
    ) as string[];
    for (const c of candidates) {
      const n = normalize(c, 42);
      if (n) return n;
    }
    return '';
  };

  const hasManager = (p: { id: number; accountManager?: string }) => !!pickManager(p);

  const isManagedBySelected = (p: { id: number; accountManager?: string }) => {
    if (!selectedAccount?.address) return false;
    const who = normalize(selectedAccount.address, 42);
    if (!who) return false;
    return pickManager(p) === who;
  };

  const counts = useMemo(() => {
    const byState = new Map<ParaState, number>();
    let renewed = 0;
    let needs = 0;
    let withMgr = 0;
    let mine = 0;
    for (const p of parachains.filter((x) => x.network === network)) {
      byState.set(p.state, (byState.get(p.state) ?? 0) + 1);
      const r = getRenewalStatus(p.id);
      if (r.key === 'renewed') renewed++;
      else needs++;
      if (hasManager(p)) withMgr++;
      if (isManagedBySelected(p)) mine++;
    }
    return {
      total: parachains.filter((x) => x.network === network).length,
      byState,
      renewed,
      needs,
      withMgr,
      mine,
    };
  }, [parachains, network, potentialRenewals, saleInfo, selectedAccount, registrarMap]);

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
    if (managerFilter === 'mine') rows = rows.filter((r) => isManagedBySelected(r));
    return rows;
  }, [baseRows, stateFilter, renewalFilter, managerFilter, selectedAccount, registrarMap]);

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

  const managerOptions: SelectOption<ManagerFilter>[] = [
    { key: 'all', label: 'All', value: 'all' },
    { key: 'mine', label: 'My projects', value: 'mine' },
  ];

  const tableData: Record<string, TableData>[] = filteredRows.map((item) => {
    const meta = chainData[networkKey]?.[item.id];
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
            <div className={styles.segmentedOld} role='tablist' aria-label='Renewal filter'>
              {renewalOptions.map((opt) => (
                <button
                  key={opt.key}
                  type='button'
                  role='tab'
                  aria-selected={renewalFilter === opt.value}
                  className={`${styles.segmentedBtn} ${renewalFilter === opt.value ? styles.active : ''}`}
                  onClick={() => setRenewalFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
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

            <div
              className={`${styles.segmentedOld} ${styles.cols2}`}
              role='tablist'
              aria-label='Manager filter'
            >
              {managerOptions.map((opt) => (
                <button
                  key={opt.key}
                  type='button'
                  role='tab'
                  aria-selected={managerFilter === opt.value}
                  className={`${styles.segmentedBtn} ${managerFilter === opt.value ? styles.active : ''}`}
                  onClick={() => setManagerFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
              <span
                className={styles.segmentedThumbOld}
                style={{
                  transform:
                    managerFilter === 'all' ? 'translateX(0)' : 'translateX(calc(100% + 6px))',
                }}
                aria-hidden='true'
              />
            </div>
          </div>
        </div>
        <div className={styles.metricsBlock}>
          <div className={styles.chipSm}>Total: {counts.total}</div>
          <div className={styles.chipSm}>Renewed: {counts.renewed}</div>
          <div className={styles.chipSm}>Needs Renewal: {counts.needs}</div>
          <div className={styles.chipSm}>With manager: {counts.withMgr}</div>
          {selectedAccount?.address && (
            <div className={styles.chipSm}>My projects: {counts.mine}</div>
          )}
          {availableStates.map((s) => (
            <div key={s} className={styles.chipSm}>
              {stateLabel(s)}: {counts.byState.get(s) ?? 0}
            </div>
          ))}
        </div>
        <TableComponent
          key={`${network}-${showWatchlist ? 'watch' : 'all'}-${stateFilter}-${renewalFilter}-${managerFilter}-${selectedAccount?.address ?? 'noacct'}`}
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
