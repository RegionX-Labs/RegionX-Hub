'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './my-regions.module.scss';
import { useUnit } from 'effector-react';
import { $regions, Region, RegionLocation } from '@/coretime/regions';
import { $connections, $network } from '@/api/connection';
import { RegionCard } from '../../../components/elements/RegionCard';
import { bitStringToUint8Array, maskToBin, timesliceToTimestamp } from '@/utils';
import { getRelativeTime } from '@/utils/time';
import { $selectedAccount } from '@/wallet';
import { encodeAddress } from '@polkadot/util-crypto';
import { FixedSizeBinary } from 'polkadot-api';
import { Search as SearchIcon } from 'lucide-react';

type RegionDateInfo = { beginDate: string; endDate: string; duration: string };
type ViewMode = 'owned' | 'all';
type NetworkMaybe = string | { name?: string; id?: string };

function getNetworkKey(network: NetworkMaybe) {
  if (typeof network === 'string') return network;
  return network?.name || network?.id || 'network';
}
function orderKeyAll(networkKey: string) {
  return `regionsOrder:${networkKey}:all`;
}
function orderKeyOwned(networkKey: string, account?: string | null) {
  return `regionsOrder:${networkKey}:${account ?? 'no-account'}:owned`;
}
function loadOrder(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}
function saveOrder(key: string, ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {}
}
function reconcileOrder(currentIds: string[], saved: string[]) {
  if (!saved?.length) return currentIds;
  const currentSet = new Set(currentIds);
  const filteredSaved = saved.filter((id) => currentSet.has(id));
  const savedSet = new Set(filteredSaved);
  const missing = currentIds.filter((id) => !savedSet.has(id));
  return [...filteredSaved, ...missing];
}

export default function MyRegionsPage() {
  const network = useUnit($network);
  const regionsAll = useUnit($regions);
  const connections = useUnit($connections);
  const selectedAccount = useUnit($selectedAccount);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [regionDateInfos, setRegionDateInfos] = useState<Record<string, RegionDateInfo>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('all');

  const networkKey = getNetworkKey(network);
  const allKey = orderKeyAll(networkKey);
  const ownedKey = orderKeyOwned(networkKey, selectedAccount?.address ?? null);

  useEffect(() => {
    const loadDates = async () => {
      const map: Record<string, RegionDateInfo> = {};
      for (const r of regionsAll) {
        const beginTs = await timesliceToTimestamp(r.begin, network, connections);
        const endTs = await timesliceToTimestamp(r.end, network, connections);
        if (beginTs && endTs) {
          const durationMs = Number(endTs - beginTs);
          const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));
          map[r.id] = {
            beginDate: getRelativeTime(beginTs),
            endDate: getRelativeTime(endTs),
            duration: `${durationDays} day${durationDays === 1 ? '' : 's'}`,
          };
        }
      }
      setRegionDateInfos(map);
      setLoading(false);
    };
    if (regionsAll.length) loadDates();
    else setLoading(false);
  }, [regionsAll, network, connections]);

  const ownedRegions = useMemo(() => {
    if (!selectedAccount) return [];
    return regionsAll.filter(
      (r) => encodeAddress(r.owner, 42) === encodeAddress(selectedAccount.address, 42)
    );
  }, [regionsAll, selectedAccount]);

  const filteredOwned = useFilterByCore(ownedRegions, query);
  const filteredAll = useFilterByCore(regionsAll, query);

  const [ownedOrder, setOwnedOrder] = useState<string[]>([]);
  const [allOrder, setAllOrder] = useState<string[]>([]);

  useEffect(() => {
    const baseIds = regionsAll.map((r) => r.id);
    const saved = loadOrder(allKey);
    const next = reconcileOrder(baseIds, saved);
    setAllOrder(next);
  }, [regionsAll, allKey]);

  useEffect(() => {
    const baseIds = ownedRegions.map((r) => r.id);
    const saved = loadOrder(ownedKey);
    const next = reconcileOrder(baseIds, saved);
    setOwnedOrder(next);
  }, [ownedRegions, ownedKey]);

  const setAllOrderAndSave = (ids: string[]) => {
    setAllOrder(ids);
    saveOrder(allKey, ids);
  };
  const setOwnedOrderAndSave = (ids: string[]) => {
    setOwnedOrder(ids);
    saveOrder(ownedKey, ids);
  };

  const ownedOrdered = orderByIds(filteredOwned, ownedOrder);
  const allOrdered = orderByIds(filteredAll, allOrder);

  const showOwned = view === 'owned';
  const showAll = view === 'all';

  return (
    <div className={styles.mainContainer}>
      <div className={styles.board}>
        <div className={styles.pageHeader}>
          {selectedAccount && <h1>Regions</h1>}
          {regionsAll.length > 0 && (
            <p className={styles.subtitle}>Browse regions and rearrange them to your liking</p>
          )}
        </div>

        <div className={styles.toolbar}>
          <div className={styles.search}>
            <SearchIcon className={styles.icon} />
            <input
              placeholder='Search by core index'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputMode='numeric'
              pattern='[0-9]*'
            />
          </div>

          <div className={styles.segmented} role='tablist' aria-label='Region view'>
            <button
              type='button'
              role='tab'
              aria-selected={showAll}
              className={`${styles.segmentedBtn} ${showAll ? styles.active : ''}`}
              onClick={() => setView('all')}
              title='Show All regions'
            >
              All regions
            </button>
            <button
              type='button'
              role='tab'
              aria-selected={showOwned}
              className={`${styles.segmentedBtn} ${showOwned ? styles.active : ''}`}
              onClick={() => setView('owned')}
              title='Show My regions'
            >
              My regions
            </button>
            <span
              className={`${styles.segmentedThumb} ${showOwned ? styles.right : ''}`}
              aria-hidden='true'
            />
          </div>

          <div className={styles.spacer} />
          <div className={styles.chip}>Total: {regionsAll.length}</div>
          {selectedAccount && <div className={styles.chip}>Owned: {ownedRegions.length}</div>}
        </div>

        {!loading && selectedAccount && ownedRegions.length === 0 && showOwned && (
          <div className={styles.messageNote}>No regions owned by the selected account.</div>
        )}
        {!loading && regionsAll.length === 0 && showAll && (
          <div className={styles.messageNote}>There are no regions available.</div>
        )}

        {showOwned && ownedRegions.length > 0 && (
          <>
            <div className={styles.sectionTitle}>Owned</div>
            <DraggableGrid
              className={styles.ownedWrap}
              regions={ownedOrdered}
              order={ownedOrder}
              setOrder={setOwnedOrderAndSave}
              regionDateInfos={regionDateInfos}
              selectedRegionId={selectedRegionId}
              setSelectedRegionId={setSelectedRegionId}
            />
          </>
        )}

        {showAll && regionsAll.length > 0 && (
          <>
            <div className={styles.sectionTitle}>All regions</div>
            <DraggableGrid
              className={styles.container}
              regions={allOrdered}
              order={allOrder}
              setOrder={setAllOrderAndSave}
              regionDateInfos={regionDateInfos}
              selectedRegionId={selectedRegionId}
              setSelectedRegionId={setSelectedRegionId}
            />
          </>
        )}
      </div>
    </div>
  );
}

function DraggableGrid(props: {
  className: string;
  regions: Region[];
  order: string[];
  setOrder: (ids: string[]) => void;
  regionDateInfos: Record<string, RegionDateInfo>;
  selectedRegionId: string | null;
  setSelectedRegionId: (id: string) => void;
}) {
  const {
    className,
    regions,
    order,
    setOrder,
    regionDateInfos,
    selectedRegionId,
    setSelectedRegionId,
  } = props;

  const dragFromIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);
  const dragImageRef = useRef<HTMLElement | null>(null);

  const ids = useMemo(() => regions.map((r) => r.id), [regions]);

  const onDragStart = (idx: number, e: React.DragEvent) => {
    dragFromIdx.current = idx;
    dragOverIdx.current = idx;

    const el = (e.target as HTMLElement)?.closest(`.${styles.cardShell}`) as HTMLElement | null;
    if (el) {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = '-1000px';
      clone.style.left = '-1000px';
      clone.style.pointerEvents = 'none';
      clone.style.opacity = '1';
      document.body.appendChild(clone);
      dragImageRef.current = clone;
      e.dataTransfer.setDragImage(clone, clone.offsetWidth / 2, clone.offsetHeight / 2);
      el.classList.add(styles.dragGhost);
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnter = (overIdx: number, e: React.DragEvent) => {
    dragOverIdx.current = overIdx;

    const li = (e.target as HTMLElement)?.closest(
      `.${styles.regionCardWrap}`
    ) as HTMLElement | null;
    if (!li) return;

    document
      .querySelectorAll(`.${styles.dragOver}`)
      .forEach((n) => n.classList.remove(styles.dragOver));
    li.classList.add(styles.dragOver);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = () => {
    const from = dragFromIdx.current;
    const over = dragOverIdx.current;
    if (from == null || over == null || from === over) return;

    const next = [...ids];
    const posFrom = from;
    const posOver = over;

    const tmp = next[posFrom];
    next[posFrom] = next[posOver];
    next[posOver] = tmp;

    setOrder(next);
  };

  const cleanupDrag = (e: React.DragEvent) => {
    const card = (e.target as HTMLElement)?.closest(`.${styles.cardShell}`) as HTMLElement | null;
    if (card) card.classList.remove(styles.dragGhost);

    document.querySelectorAll(`.${styles.dragOver}`).forEach((n) => {
      n.classList.remove(styles.dragOver);
    });

    if (dragImageRef.current) {
      dragImageRef.current.remove();
      dragImageRef.current = null;
    }
    dragFromIdx.current = null;
    dragOverIdx.current = null;
  };

  const countBits = (hexMask: string) => {
    let c = 0;
    for (let i = 2; i < hexMask.length; ++i) {
      let v = parseInt(hexMask.slice(i, i + 1), 16);
      while (v > 0) {
        if (v & 1) ++c;
        v >>= 1;
      }
    }
    return c;
  };

  return (
    <ul className={className} role='list'>
      {regions.map((region, idx) => {
        const info = regionDateInfos[region.id];
        const regionStart = info?.beginDate
          ? `Begin: ${info.beginDate}`
          : `Begin: Timeslice #${region.begin}`;
        const regionEnd = info?.endDate ? `End: ${info.endDate}` : `End: Timeslice #${region.end}`;
        const storageKey = `regionName-${regionStart}-${regionEnd}-${region.core}`;
        const storedName = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

        return (
          <li key={region.id} className={styles.regionCardWrap}>
            <div
              className={styles.cardShell}
              draggable
              onDragStart={(e) => onDragStart(idx, e)}
              onDragEnter={(e) => onDragEnter(idx, e)}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={cleanupDrag}
            >
              <RegionCard
                selected={selectedRegionId === region.id}
                regionId={{
                  begin: region.begin,
                  core: region.core,
                  mask: new FixedSizeBinary(bitStringToUint8Array(maskToBin(region.mask))),
                }}
                regionData={{
                  chainColor:
                    region.location === RegionLocation.RegionxChain ? 'blueDark' : 'greenDark',
                  chainLabel:
                    region.location === RegionLocation.RegionxChain
                      ? 'RegionX Chain'
                      : 'Coretime Chain',
                  coreIndex: region.core,
                  consumed: 0,
                  coreOcupaccy: ((countBits(region.mask) * 720) / 57600) * 100,
                  duration: info?.duration || '28 days',
                  name: storedName || `Region #${region.core}`,
                  regionStart,
                  regionEnd,
                  regionBeginTimeslice: region.begin,
                  regionEndTimeslice: region.end,
                  currentUsage: 0,
                  onClick: () => setSelectedRegionId(region.id),
                  owner: encodeAddress(region.owner, 42),
                  paid: region.paid,
                }}
                task={region.task === 0 ? 'Unassigned' : region.task.toString()}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function useFilterByCore(regions: Region[], q: string) {
  const needle = q.trim();
  if (!needle) return regions;
  return regions.filter((r) => `${r.core}`.includes(needle));
}

function orderByIds(regs: Region[], order: string[]) {
  if (!order.length) return regs;
  const pos = new Map(order.map((id, i) => [id, i]));
  return [...regs].sort((a, b) => (pos.get(a.id) ?? 1e9) - (pos.get(b.id) ?? 1e9));
}
