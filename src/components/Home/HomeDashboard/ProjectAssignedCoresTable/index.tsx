'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './ProjectAssignedCoresTable.module.scss';
import { TableComponent } from '@/components/elements/TableComponent';
import { $connections, $network } from '@/api/connection';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { timesliceToTimestamp } from '@/utils';

type RowCell =
  | { cellType: 'text'; data: string; searchKey?: string }
  | { cellType: 'jsx'; data: React.ReactElement; searchKey?: string };

type Row = Record<string, RowCell>;

type Props = { taskParaId?: string | null };

type WorkItem = {
  source: 'workload' | 'workplan';
  core: number;
  task: number;
  beginTs?: number | null;
  endTs?: number | null;
};

const safeHuman = (v: any) => (v && typeof v.toHuman === 'function' ? v.toHuman() : v);
const toJSON = (v: any) => (v?.toJSON ? v.toJSON() : v);

export default function ProjectAssignedCoresTable({ taskParaId }: Props) {
  const network = useUnit($network);
  const connections = useUnit($connections);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const taskId = useMemo(() => {
    if (!taskParaId) return null;
    const n = Number(taskParaId);
    return Number.isFinite(n) ? n : null;
  }, [taskParaId]);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        setRows([]);

        console.log('[AssignedCores] start', { network, hasConnections: !!connections, taskId });

        if (!network || !connections) {
          console.log('[AssignedCores] early return: missing network/connections');
          setLoading(false);
          return;
        }
        if (taskId == null) {
          console.log('[AssignedCores] early return: taskId is null (no paraId selected)');
          setLoading(false);
          return;
        }

        const metadata = getNetworkMetadata(network as any);
        const chainIds = getNetworkChainIds(network as any);
        const conn = chainIds ? connections[chainIds.coretimeChain] : null;
        const client: any = conn?.client;

        console.log('[AssignedCores] meta/ids', {
          hasMetadata: !!metadata,
          chainIds,
          hasClient: !!client,
        });

        if (!metadata || !client) {
          console.log('[AssignedCores] early return: missing metadata/client');
          setLoading(false);
          return;
        }

        const typedApi: any = client.getTypedApi(metadata.coretimeChain);
        const qAny = typedApi?.query as any;

        const palletName =
          (qAny?.broker && 'broker') ||
          (qAny?.Broker && 'Broker') ||
          (qAny?.coretimeBroker && 'coretimeBroker') ||
          (qAny?.CoretimeBroker && 'CoretimeBroker') ||
          null;

        const pallet = palletName ? qAny[palletName] : null;

        console.log('[AssignedCores] typedApi present:', !!typedApi, 'palletName:', palletName);

        if (!pallet) {
          console.log(
            '[AssignedCores] early return: broker/coretimeBroker pallet not found on query'
          );
          setError('Broker/coretimeBroker pallet not available on this network connection.');
          setLoading(false);
          return;
        }

        const out: WorkItem[] = [];

        const numLike = (v: any): number | null => {
          const n = Number(v);
          return Number.isFinite(n) ? n : null;
        };
        const unwrapOpt = (v: any) => {
          const j = toJSON(v);
          if (j && typeof j === 'object') {
            if ('Some' in j) return j.Some;
            if ('None' in j) return null;
            if ('value' in j) return j.value;
          }
          return j;
        };
        const getTaskFromAny = (val: any): number | null => {
          const j = unwrapOpt(val);
          if (j == null) return null;
          if (typeof j === 'number' || typeof j === 'string') return numLike(j);
          if (typeof j === 'object') {
            if ('task' in j) return numLike((j as any).task);
            if ('value' in j && j.value && typeof j.value === 'object' && 'task' in j.value)
              return numLike(j.value.task);
            const anyNum = Object.values(j).find((x) => Number.isFinite(Number(x)));
            return numLike(anyNum);
          }
          return null;
        };
        const getCoreFromKey = (key: any): number | null => {
          if (key?.args && Array.isArray(key.args) && key.args.length > 0)
            return numLike(key.args[0]);
          const kj = toJSON(key);
          if (kj == null) return null;
          if (typeof kj === 'number' || typeof kj === 'string') return numLike(kj);
          if (Array.isArray(kj)) return kj.length > 0 ? numLike(kj[0]) : null;
          if (typeof kj === 'object') {
            if ('core' in kj) return numLike((kj as any).core);
            const firstNum = Object.values(kj).find((v) => Number.isFinite(Number(v)));
            return numLike(firstNum);
          }
          return null;
        };
        const timesliceNum = (v: any): number | null => {
          if (v == null) return null;
          if (typeof v === 'number') return v;
          if (typeof v === 'string') return numLike(v);
          if (typeof v === 'bigint') return Number(v);
          const j = toJSON(v);
          if (typeof j === 'number' || typeof j === 'string') return numLike(j);
          return null;
        };

        const readEntries = async (node: any) => {
          if (!node) return [];
          if (typeof node.entries === 'function') return (await node.entries()) || [];
          if (typeof node.getEntries === 'function') return (await node.getEntries()) || [];
          return [];
        };

        try {
          let workloadEntries: any[] = await readEntries(pallet?.workload);
          console.log('[AssignedCores][workload] entries len:', workloadEntries?.length);
          console.log(
            '[AssignedCores][workload] raw entries:',
            workloadEntries.map((e: any) => [
              safeHuman(e?.[0] ?? e?.key ?? e),
              safeHuman(e?.[1] ?? e?.value ?? e),
            ])
          );

          if (workloadEntries.length) {
            for (const [key, val] of workloadEntries) {
              console.log('[AssignedCores][workload] entry', {
                keyRaw: key,
                keyHuman: safeHuman(key),
                valRaw: val,
                valHuman: safeHuman(val),
              });
              const coreId = getCoreFromKey(key);
              const assignedTask = getTaskFromAny(val);
              if (coreId != null && assignedTask === taskId) {
                out.push({ source: 'workload', core: coreId, task: assignedTask! });
              }
            }
          } else {
            const fromTask =
              (await pallet?.workloadOf?.getValue?.(taskId)) ??
              (await pallet?.workloadOf?.(taskId));
            console.log(
              '[AssignedCores][workloadOf] raw:',
              fromTask,
              'human:',
              safeHuman(fromTask)
            );
            const list = unwrapOpt(fromTask);
            if (Array.isArray(list)) {
              for (const core of list) {
                const c = numLike(core);
                if (c != null) out.push({ source: 'workload', core: c, task: taskId });
              }
            }
          }
        } catch (e) {
          console.log('[AssignedCores][workload] read failed:', e);
        }

        try {
          let planEntries: any[] = await readEntries(pallet?.workplan);
          console.log('[AssignedCores][workplan] entries len:', planEntries?.length);
          console.log(
            '[AssignedCores][workplan] raw entries:',
            planEntries.map((e: any) => [
              safeHuman(e?.[0] ?? e?.key ?? e),
              safeHuman(e?.[1] ?? e?.value ?? e),
            ])
          );

          const pushPlanItem = (coreId: number | null, item: any) => {
            console.log('[AssignedCores][workplan] item raw:', item, 'human:', safeHuman(item));
            if (!item) return;
            const t = getTaskFromAny(item);
            if (t !== taskId) return;
            const begin = timesliceNum(item?.begin);
            const end = timesliceNum(item?.end);
            out.push({
              source: 'workplan',
              core: numLike(coreId ?? item?.core) ?? -1,
              task: t!,
              beginTs: begin,
              endTs: end,
            });
          };

          if (planEntries.length) {
            for (const [key, val] of planEntries) {
              console.log('[AssignedCores][workplan] entry', {
                keyRaw: key,
                keyHuman: safeHuman(key),
                valRaw: val,
                valHuman: safeHuman(val),
              });
              const coreFromKey = getCoreFromKey(key);
              const vj = unwrapOpt(val);
              if (Array.isArray(vj)) {
                for (const item of vj) pushPlanItem(coreFromKey, item);
              } else if (typeof vj === 'object' && vj) {
                pushPlanItem(coreFromKey, vj);
              }
            }
          } else {
            const planForTask =
              (await pallet?.workplanOf?.getValue?.(taskId)) ??
              (await pallet?.workplanOf?.(taskId));
            console.log(
              '[AssignedCores][workplanOf] raw:',
              planForTask,
              'human:',
              safeHuman(planForTask)
            );
            const j = unwrapOpt(planForTask);
            if (Array.isArray(j)) {
              for (const item of j) {
                const core = numLike(item?.core);
                const t = getTaskFromAny(item);
                if (t === taskId && core != null) {
                  out.push({
                    source: 'workplan',
                    core,
                    task: t!,
                    beginTs: timesliceNum(item?.begin),
                    endTs: timesliceNum(item?.end),
                  });
                }
              }
            }
          }
        } catch (e) {
          console.log('[AssignedCores][workplan] read failed:', e);
        }

        const seen = new Set<string>();
        const unique = out.filter((it) => {
          const k = `${it.source}:${it.core}:${it.beginTs ?? ''}:${it.endTs ?? ''}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });

        unique.sort((a, b) => {
          if (a.core !== b.core) return a.core - b.core;
          const aB = a.beginTs ?? 0;
          const bB = b.beginTs ?? 0;
          return aB - bB;
        });

        const tableRows: Row[] = [];
        for (const item of unique) {
          const beginDate =
            item.beginTs != null
              ? await tsToLocale(item.beginTs, network as any, connections)
              : '—';
          const endDate =
            item.endTs != null ? await tsToLocale(item.endTs, network as any, connections) : '—';

          tableRows.push({
            Core: { cellType: 'text', data: String(item.core), searchKey: String(item.core) },
            Source: {
              cellType: 'text',
              data: item.source === 'workload' ? 'Workload (current)' : 'Workplan (scheduled)',
              searchKey: item.source,
            },
            'Begin (date)': { cellType: 'text', data: beginDate, searchKey: beginDate },
            'End (date)': { cellType: 'text', data: endDate, searchKey: endDate },
          });
        }

        console.log('[AssignedCores] rows prepared:', tableRows);
        setRows(tableRows);
        setLoading(false);
      } catch (e: any) {
        console.log('[AssignedCores] fatal error:', e);
        setError(e?.message ?? 'Failed to load assigned cores.');
        setLoading(false);
      }
    };

    run();
  }, [network, connections, taskId]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Assigned Cores for Project</h2>
      {!taskId ? (
        <div className={styles.note}>Select a parachain above to see its assigned cores.</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : loading ? (
        <div className={styles.note}>Loading…</div>
      ) : rows.length === 0 ? (
        <div className={styles.note}>No cores are assigned to this project.</div>
      ) : (
        <TableComponent data={rows} pageSize={8} />
      )}
    </div>
  );
}

async function tsToLocale(timeslice: number, network: any, connections: any): Promise<string> {
  try {
    const ms = await timesliceToTimestamp(timeslice, network, connections);
    if (!ms) return '—';
    return new Date(Number(ms)).toLocaleString();
  } catch {
    return '—';
  }
}
