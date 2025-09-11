'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { CoretimeMetadata, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { TableComponent } from '@/components/elements/TableComponent';
import { $parachains } from '@/parachains';
import { ParaState } from '@/components/ParaStateCard';
import styles from './ProjectAssignedCoresTable.module.scss';

type TableCell =
  | { cellType: 'text'; data: string; searchKey?: string }
  | { cellType: 'jsx'; data: React.ReactElement; searchKey?: string };

type Row = Record<string, TableCell>;

type Props = {
  taskId?: number;
  pageSize?: number;
};

type RawEntry = {
  source: 'Currently Assigned' | 'Scheduled Assignment';
  core: number | null;
  task: number | null;
};

export default function ProjectAssignedCoresTable({ taskId, pageSize = 8 }: Props) {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const parachains = useUnit($parachains);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const isSystemPara = useMemo(() => {
    const p = parachains.find((p) => p.network === network && p.id === taskId);
    return p?.state === ParaState.SYSTEM;
  }, [parachains, network]);

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
        if (!typedApi) return setRows([]);
        const [workloadEntries, workplanEntries] = await Promise.all([
          typedApi.query.Broker.Workload.getEntries(),
          typedApi.query.Broker.Workplan.getEntries(),
        ]);

        const normalize = (pallet: 'workload' | 'workplan', e: any): RawEntry => {
          console.log(e);
          const core = pallet === 'workload' ? e.keyArgs?.[0] : e.keyArgs?.core;
          const task = e.value[0].assignment.value;

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

        const filtered = taskId === null ? raw : raw.filter((r) => r.task === taskId);

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
  }, [network, connections]);

  const Title = (
    <div className={styles.header}>
      <h3 className={styles.heading}>Assigned Cores</h3>
      <div className={styles.subheading}>
        <span className={styles.pill}>Para ID: {taskId}</span>
        {isSystemPara && (
          <span className={`${styles.pill} ${styles.system}`}>System Parachain</span>
        )}
      </div>
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
            : `No assignments found${taskId !== null ? ` for project ${taskId}` : ''}.`}
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
