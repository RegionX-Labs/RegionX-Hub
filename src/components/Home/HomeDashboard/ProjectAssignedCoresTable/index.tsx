'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { timesliceToTimestamp } from '@/utils';
import { TableComponent } from '@/components/elements/TableComponent';
import { $parachains } from '@/parachains';
import { ParaState } from '@/components/ParaStateCard';
import styles from './ProjectAssignedCoresTable.module.scss';

type TableCell =
  | { cellType: 'text'; data: string; searchKey?: string }
  | { cellType: 'jsx'; data: React.ReactElement; searchKey?: string };

type Row = Record<string, TableCell>;

type Props = {
  taskParaId?: string | number | null;
  pageSize?: number;
};

type RawEntry = {
  source: 'Currently Assigned' | 'Scheduled Assignment';
  core: number | null;
  task: number | null;
  begin: number | null;
  end: number | null;
};

const toMillis = (v: unknown): number | null => {
  if (v == null) return null;
  const t =
    typeof v === 'bigint'
      ? Number(v)
      : typeof v === 'number'
        ? v
        : v instanceof Date
          ? v.getTime()
          : NaN;
  return Number.isFinite(t) ? t : null;
};

const fmtMillis = (ms: number | null): string => {
  if (ms == null) return '-';
  const d = new Date(ms);
  if (!Number.isFinite(d.getTime())) return '-';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ProjectAssignedCoresTable({ taskParaId, pageSize = 8 }: Props) {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const parachains = useUnit($parachains);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const filterTask = useMemo(() => {
    if (taskParaId === null || taskParaId === undefined || taskParaId === '') return null;
    const n = Number(taskParaId);
    return Number.isFinite(n) ? n : null;
  }, [taskParaId]);

  const isSystemPara = useMemo(() => {
    if (filterTask == null) return false;
    const p = parachains.find((p) => p.network === network && p.id === filterTask);
    return p?.state === ParaState.SYSTEM;
  }, [parachains, network, filterTask]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const chainIds = getNetworkChainIds(network);
        if (!chainIds) return setRows([]);
        const connection = connections[chainIds.coretimeChain];
        if (!connection || !connection.client || connection.status !== 'connected')
          return setRows([]);

        const metadata = getNetworkMetadata(network);
        if (!metadata) return setRows([]);

        const typedApi = connection.client.getTypedApi(metadata.coretimeChain);

        const [workloadEntries, workplanEntries] = await Promise.all([
          typedApi?.query?.Broker?.Workload?.getEntries?.() ?? [],
          typedApi?.query?.Broker?.Workplan?.getEntries?.() ?? [],
        ]);

        const pickNum = (v: any): number | null =>
          typeof v === 'number' ? v : typeof v?.value === 'number' ? v.value : null;

        const normalize = (pallet: 'workload' | 'workplan', e: any): RawEntry => {
          const core = pickNum(e?.keyArgs?.[0]) ?? pickNum(e?.keyArgs?.core);
          const begin =
            pickNum(e?.keyArgs?.[1]) ??
            pickNum(e?.value?.begin) ??
            (pallet === 'workplan' ? pickNum(e?.value?.when) : null);
          const end = pickNum(e?.value?.end) ?? pickNum(e?.value?.until);
          const task =
            pickNum(e?.value?.task) ??
            pickNum(e?.value?.assignment) ??
            (typeof e?.value?.[0]?.assignment?.value === 'number'
              ? e.value[0].assignment.value
              : null);

          return {
            source: pallet === 'workload' ? 'Currently Assigned' : 'Scheduled Assignment',
            core: core ?? null,
            task: task ?? null,
            begin: begin ?? null,
            end: end ?? null,
          };
        };

        const raw: RawEntry[] = [
          ...workloadEntries.map((e: any) => normalize('workload', e)),
          ...workplanEntries.map((e: any) => normalize('workplan', e)),
        ].filter((r) => r.core !== null && r.task !== null);

        const filtered = filterTask === null ? raw : raw.filter((r) => r.task === filterTask);

        const withTimestamps = [];
        for (const r of filtered) {
          const bdUnknown: unknown =
            r.begin !== null ? await timesliceToTimestamp(r.begin, network, connections) : null;
          const edUnknown: unknown =
            r.end !== null ? await timesliceToTimestamp(r.end, network, connections) : null;

          const beginTs = toMillis(bdUnknown);
          const endTs = toMillis(edUnknown);

          withTimestamps.push({ ...r, beginTs, endTs });
        }

        withTimestamps.sort((a, b) => {
          if (a.beginTs != null && b.beginTs != null) return a.beginTs - b.beginTs;
          if (a.beginTs != null) return -1;
          if (b.beginTs != null) return 1;
          return (a.core ?? 0) - (b.core ?? 0);
        });

        const tableRows: Row[] = withTimestamps.map((r: any) => ({
          Source: { cellType: 'text', data: r.source },
          Core: { cellType: 'text', data: String(r.core) },
          Task: { cellType: 'text', data: String(r.task) },
          Begin: { cellType: 'text', data: fmtMillis(r.beginTs) },
          End: { cellType: 'text', data: fmtMillis(r.endTs) },
        }));

        setRows(tableRows);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [network, connections, filterTask]);

  if (loading && rows.length === 0) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.heading}>Assigned Cores</h3>
        <div className={styles.skeleton}>Loading…</div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.heading}>Assigned Cores</h3>
        <div className={styles.empty}>
          {isSystemPara
            ? 'Parachain system always has assigned cores.'
            : `No assignments found${filterTask !== null ? ` for project ${filterTask}` : ''}.`}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>
        Assigned Cores{filterTask !== null ? ` — Project ${filterTask}` : ''}
      </h3>
      <TableComponent data={rows} pageSize={pageSize} />
    </div>
  );
}
