'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { timesliceToTimestamp } from '@/utils';
import { TableComponent } from '@/components/elements/TableComponent';
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
  source: 'workload' | 'workplan';
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
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const filterTask = useMemo(() => {
    if (taskParaId === null || taskParaId === undefined || taskParaId === '') return null;
    const n = Number(taskParaId);
    return Number.isFinite(n) ? n : null;
  }, [taskParaId]);

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

        const normalize = (source: 'workload' | 'workplan', e: any): RawEntry => {
          const core =
            typeof e?.keyArgs?.[0] === 'number'
              ? e.keyArgs[0]
              : typeof e?.keyArgs?.core === 'number'
                ? e.keyArgs.core
                : null;

          const begin =
            typeof e?.keyArgs?.[1] === 'number'
              ? e.keyArgs[1]
              : typeof e?.value?.begin?.value === 'number'
                ? e.value.begin.value
                : typeof e?.value?.begin === 'number'
                  ? e.value.begin
                  : null;

          const end =
            typeof e?.value?.end?.value === 'number'
              ? e.value.end.value
              : typeof e?.value?.end === 'number'
                ? e.value.end
                : null;

          const task =
            typeof e?.value?.task?.value === 'number'
              ? e.value.task.value
              : typeof e?.value?.task === 'number'
                ? e.value.task
                : typeof e?.value?.assignment?.value === 'number'
                  ? e.value.assignment.value
                  : typeof e?.value?.[0]?.assignment?.value === 'number'
                    ? e.value[0].assignment.value
                    : null;

          return { source, core, task, begin, end };
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
          No assignments found{filterTask !== null ? ` for project ${filterTask}` : ''}.
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
