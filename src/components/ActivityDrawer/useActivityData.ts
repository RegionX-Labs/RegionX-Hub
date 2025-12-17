import { useEffect, useMemo, useState } from 'react';
import { Network } from '@/types';
import { toUnitFormatted } from '@/utils';

export type TxStatus = 'pending' | 'success' | 'failed';

export type TxItem = {
  id: string;
  type: string;
  network: string;
  amount: string;
  when: string;
  hash: string;
  link?: string;
  status: TxStatus;
};

type SubscanExtrinsic = {
  extrinsic_hash?: string;
  hash?: string;
  extrinsic_index?: string;
  call_module?: string;
  call_module_function?: string;
  success?: boolean;
  finalized?: boolean;
  block_timestamp?: number;
  params?: string | { name: string; value: unknown }[];
  fee?: string | number;
};

type UseActivityDataParams = {
  open: boolean;
  network: Network | null;
  address: string | null;
};

const SUBSCAN_API_BASE: Partial<Record<Network, string>> = {
  [Network.POLKADOT]: 'https://coretime-polkadot.api.subscan.io',
  [Network.KUSAMA]: 'https://coretime-kusama.api.subscan.io',
  [Network.PASEO]: 'https://coretime-paseo.api.subscan.io',
  [Network.WESTEND]: 'https://coretime-westend.api.subscan.io',
};

const SUBSCAN_EXPLORER_BASE: Partial<Record<Network, string>> = {
  [Network.POLKADOT]: 'https://coretime-polkadot.subscan.io',
  [Network.KUSAMA]: 'https://coretime-kusama.subscan.io',
  [Network.PASEO]: 'https://coretime-paseo.subscan.io',
  [Network.WESTEND]: 'https://coretime-westend.subscan.io',
};

const TYPE_LABELS: Record<string, string> = {
  'balances.transfer': 'Transfer',
  'balances.transfer_keep_alive': 'Transfer',
  'broker.buy_core': 'Buy Core',
  'broker.renew_core': 'Renew Core',
  'broker.list': 'List Region',
  'broker.unlist': 'Unlist Region',
};

const shortenHash = (hash: string) =>
  hash.length > 12 ? `${hash.slice(0, 6)}...${hash.slice(-6)}` : hash;

const formatTitle = (value: string) => {
  if (!value) return 'Extrinsic';
  return value
    .split('.')
    .map((part) =>
      part
        .split('_')
        .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : ''))
        .join(' ')
    )
    .join(' • ');
};

const formatTimeAgo = (timestampSeconds: number | undefined) => {
  if (!timestampSeconds) return '-';
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestampSeconds * 1000) / 1000));
  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  const days = Math.floor(diffSeconds / 86400);
  return days === 1 ? 'Yesterday' : `${days}d ago`;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (process.env.NEXT_PUBLIC_SUBSCAN_API_KEY) {
    headers['X-API-Key'] = process.env.NEXT_PUBLIC_SUBSCAN_API_KEY;
  }
  return headers;
};

const parseAmount = (params: SubscanExtrinsic['params'], network: Network): string | null => {
  if (!params) return null;
  try {
    const parsed =
      typeof params === 'string'
        ? (JSON.parse(params) as { name: string; value: unknown }[])
        : params;
    if (!Array.isArray(parsed)) return null;
    const amountParam = parsed.find((p) =>
      ['value', 'amount', 'max_payment', 'balance'].includes(p.name)
    );
    if (!amountParam || amountParam.value == null) return null;
    const rawValue =
      typeof amountParam.value === 'number'
        ? BigInt(amountParam.value)
        : BigInt(String(amountParam.value));
    return toUnitFormatted(network, rawValue);
  } catch {
    return null;
  }
};

const mapExtrinsicToTx = (ex: SubscanExtrinsic, network: Network): TxItem | null => {
  const hash = ex.extrinsic_hash || ex.hash;
  if (!hash) return null;

  const moduleName = ex.call_module || '';
  const call = ex.call_module_function || '';
  const key = `${moduleName}.${call}`.toLowerCase();
  const type = TYPE_LABELS[key] || formatTitle(`${moduleName}.${call}`);
  const status: TxStatus = ex.finalized === false ? 'pending' : ex.success ? 'success' : 'failed';
  const networkLabel = network ? network.charAt(0).toUpperCase() + network.slice(1) : 'Network';
  const when = formatTimeAgo(ex.block_timestamp);
  const fee = ex.fee ? toUnitFormatted(network, BigInt(ex.fee)) : null;
  const amount = parseAmount(ex.params, network) || (fee ? `Fee: ${fee}` : '-');
  const explorerBase = SUBSCAN_EXPLORER_BASE[network];

  return {
    id: ex.extrinsic_index || hash,
    type,
    network: networkLabel,
    amount,
    when,
    hash: shortenHash(hash),
    link: explorerBase ? `${explorerBase}/extrinsic/${hash}` : undefined,
    status,
  };
};

export const useActivityData = ({ open, network, address }: UseActivityDataParams) => {
  const [inProgress, setInProgress] = useState<TxItem[]>([]);
  const [history, setHistory] = useState<TxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (!network || !address) {
      setError('Connect a wallet to view activity.');
      setHistory([]);
      setInProgress([]);
      return;
    }
    const baseUrl = SUBSCAN_API_BASE[network];
    if (!baseUrl) {
      setError('Subscan is not available for this network.');
      setHistory([]);
      setInProgress([]);
      return;
    }

    let cancelled = false;
    const fetchActivity = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/api/v2/scan/extrinsics`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            address,
            row: 15,
            page: 0,
          }),
        });
        const json = await res.json();
        if (!res.ok || json?.code !== 0) {
          throw new Error(json?.message || 'Failed to fetch activity');
        }
        const extrinsics: SubscanExtrinsic[] = json.data?.extrinsics || json.data?.list || [];
        const mapped = extrinsics
          .map((ex: SubscanExtrinsic) => mapExtrinsicToTx(ex, network))
          .filter(Boolean) as TxItem[];

        if (cancelled) return;
        const pending = mapped.filter((tx) => tx.status === 'pending');
        const completed = mapped.filter((tx) => tx.status !== 'pending');
        setInProgress(pending);
        setHistory(completed);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch activity');
        setHistory([]);
        setInProgress([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchActivity();
    return () => {
      cancelled = true;
    };
  }, [open, network, address]);

  const statusMessage = useMemo(() => {
    if (loading) return 'Loading latest activity...';
    if (error) return error;
    if (!address) return 'Connect a wallet to view activity.';
    return null;
  }, [loading, error, address]);

  return { inProgress, history, loading, error, statusMessage };
};
