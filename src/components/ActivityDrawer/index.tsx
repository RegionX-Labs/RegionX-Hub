'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './ActivityDrawer.module.scss';
import { X, Bell, CheckCircle2, Loader2, AlertTriangle, Clock3, ExternalLink } from 'lucide-react';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { Network } from '@/types';
import { toUnitFormatted } from '@/utils';

type TxStatus = 'pending' | 'success' | 'failed';

type TxItem = {
  id: string;
  type: string;
  network: string;
  amount: string;
  when: string;
  hash: string;
  link?: string;
  status: TxStatus;
};

type Props = {
  open: boolean;
  onClose: () => void;
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
  const type = TYPE_LABELS[key] || (moduleName && call ? `${moduleName}.${call}` : 'Extrinsic');
  const status: TxStatus = ex.finalized === false ? 'pending' : ex.success ? 'success' : 'failed';
  const networkLabel = network ? network.charAt(0).toUpperCase() + network.slice(1) : 'Network';
  const when = formatTimeAgo(ex.block_timestamp);
  const amount = parseAmount(ex.params, network) || (ex.fee ? `${ex.fee} fee` : '-');
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

function StatusIcon({ status }: { status: TxStatus }) {
  if (status === 'pending') return <Loader2 className={styles.spin} size={16} />;
  if (status === 'success') return <CheckCircle2 size={16} />;
  return <AlertTriangle size={16} />;
}

function StatusPill({ status }: { status: TxStatus }) {
  return <span className={`${styles.status} ${styles[status]}`}>{status}</span>;
}

export default function ActivityDrawer({ open, onClose }: Props) {
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);
  const [inProgress, setInProgress] = useState<TxItem[]>([]);
  const [history, setHistory] = useState<TxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (!network || !selectedAccount) {
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
            address: selectedAccount.address,
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
  }, [open, network, selectedAccount]);

  const emptyInProgress = !loading && inProgress.length === 0;
  const emptyHistory = !loading && history.length === 0;

  const statusMessage = useMemo(() => {
    if (loading) return 'Loading latest activity...';
    if (error) return error;
    if (!selectedAccount) return 'Connect a wallet to view activity.';
    return null;
  }, [loading, error, selectedAccount]);

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.open : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        aria-hidden={!open}
        aria-label='Activity'
      >
        <div className={styles.header}>
          <div className={styles.titleLeft}>
            <div className={styles.bellBadge}>
              <Bell size={16} />
            </div>
            <div className={styles.titles}>
              <h3>Activity</h3>
              <p>Transactions & statuses</p>
            </div>
          </div>
          <button className={styles.iconBtn} onClick={onClose} aria-label='Close'>
            <X size={18} />
          </button>
        </div>

        {statusMessage ? (
          <div className={styles.section}>
            <div className={styles.empty}>{statusMessage}</div>
          </div>
        ) : (
          <>
            {/* In Progress */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Clock3 size={16} />
                <span>In progress</span>
              </div>
              {loading ? (
                <div className={styles.empty}>Loading latest activity...</div>
              ) : emptyInProgress ? (
                <div className={styles.empty}>No active transactions.</div>
              ) : (
                <ul className={styles.list}>
                  {inProgress.map((tx) => (
                    <li key={tx.id} className={styles.item}>
                      <div className={styles.itemTop}>
                        <div className={styles.left}>
                          <div className={`${styles.icon} ${styles[tx.status]}`}>
                            <StatusIcon status={tx.status} />
                          </div>
                          <div className={styles.meta}>
                            <div className={styles.row1}>
                              <span className={styles.type}>{tx.type}</span>
                              <StatusPill status={tx.status} />
                            </div>
                            <div className={styles.row2}>
                              <span className={styles.amount}>{tx.amount}</span>
                              <span className={styles.bullet}>•</span>
                              <span className={styles.network}>{tx.network}</span>
                              <span className={styles.bullet}>•</span>
                              <span className={styles.when}>{tx.when}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          className={styles.hashBtn}
                          title='Open in explorer'
                          disabled={!tx.link}
                          onClick={() => tx.link && window.open(tx.link, '_blank')}
                        >
                          <span>{tx.hash}</span>
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* History */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span>History</span>
              </div>
              {loading ? (
                <div className={styles.empty}>Loading latest activity...</div>
              ) : emptyHistory ? (
                <div className={styles.empty}>No recent transactions found.</div>
              ) : (
                <ul className={styles.list}>
                  {history.map((tx) => (
                    <li key={tx.id} className={styles.item}>
                      <div className={styles.itemTop}>
                        <div className={styles.left}>
                          <div className={`${styles.icon} ${styles[tx.status]}`}>
                            <StatusIcon status={tx.status} />
                          </div>
                          <div className={styles.meta}>
                            <div className={styles.row1}>
                              <span className={styles.type}>{tx.type}</span>
                              <StatusPill status={tx.status} />
                            </div>
                            <div className={styles.row2}>
                              <span className={styles.amount}>{tx.amount}</span>
                              <span className={styles.bullet}>•</span>
                              <span className={styles.network}>{tx.network}</span>
                              <span className={styles.bullet}>•</span>
                              <span className={styles.when}>{tx.when}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          className={styles.hashBtn}
                          title='Open in explorer'
                          disabled={!tx.link}
                          onClick={() => tx.link && window.open(tx.link, '_blank')}
                        >
                          <span>{tx.hash}</span>
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </aside>
    </>
  );
}
