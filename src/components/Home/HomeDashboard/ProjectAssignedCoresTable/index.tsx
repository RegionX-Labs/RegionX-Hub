'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
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
          };
        };

        const raw: RawEntry[] = [
          ...workloadEntries.map((e: any) => normalize('workload', e)),
          ...workplanEntries.map((e: any) => normalize('workplan', e)),
        ].filter((r) => r.core !== null && r.task !== null);

        const filtered = filterTask === null ? raw : raw.filter((r) => r.task === filterTask);

        const tableRows: Row[] = filtered.map((r: any) => ({
          Source: { cellType: 'text', data: r.source },
          Core: { cellType: 'text', data: String(r.core) },
          Task: { cellType: 'text', data: String(r.task) },
        }));

        setRows(tableRows);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [network, connections, filterTask]);

  const Title = (
    <div className={styles.header}>
      <h3 className={styles.heading}>Assigned Cores</h3>
      {filterTask !== null && (
        <div className={styles.subheading}>
          <span className={styles.pill}>Para ID: {filterTask}</span>
          {isSystemPara && (
            <span className={`${styles.pill} ${styles.system}`}>System Parachain</span>
          )}
        </div>
      )}
    </div>
  );

  if (loading && rows.length === 0) {
    return (
      <div className={styles.wrapper}>
        {Title}
        <div className={styles.skeleton}>Loading…</div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className={styles.wrapper}>
        {Title}
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
      {Title}
      <TableComponent data={rows} pageSize={pageSize} />
    </div>
  );
}
