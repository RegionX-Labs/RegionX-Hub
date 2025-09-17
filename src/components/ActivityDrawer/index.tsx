'use client';

import { useEffect } from 'react';
import styles from './ActivityDrawer.module.scss';
import { X, Bell, CheckCircle2, Loader2, AlertTriangle, Clock3, ExternalLink } from 'lucide-react';

type TxStatus = 'pending' | 'success' | 'failed';

type TxItem = {
  id: string;
  type: 'Buy Core' | 'Renew Core' | 'Transfer' | 'List Region' | 'Unlist Region';
  network: 'Relay' | 'Coretime' | 'RegionX';
  amount: string;
  when: string;
  hash: string;
  status: TxStatus;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const mockInProgress: TxItem[] = [
  {
    id: 'tx_001',
    type: 'Buy Core',
    network: 'Coretime',
    amount: '1.00 KSM',
    when: 'Just now',
    hash: '0x91a4...b3e9',
    status: 'pending',
  },
];

const mockHistory: TxItem[] = [
  {
    id: 'tx_100',
    type: 'Transfer',
    network: 'Relay',
    amount: '3.25 DOT',
    when: '12 min ago',
    hash: '0x2af0...7c1d',
    status: 'success',
  },
  {
    id: 'tx_099',
    type: 'List Region',
    network: 'RegionX',
    amount: '0.00 KSM',
    when: '1h ago',
    hash: '0xab02...d91f',
    status: 'success',
  },
  {
    id: 'tx_098',
    type: 'Renew Core',
    network: 'Coretime',
    amount: '0.85 KSM',
    when: 'Yesterday',
    hash: '0x7e33...aa02',
    status: 'failed',
  },
];

function StatusIcon({ status }: { status: TxStatus }) {
  if (status === 'pending') return <Loader2 className={styles.spin} size={16} />;
  if (status === 'success') return <CheckCircle2 size={16} />;
  return <AlertTriangle size={16} />;
}

function StatusPill({ status }: { status: TxStatus }) {
  return <span className={`${styles.status} ${styles[status]}`}>{status}</span>;
}

export default function ActivityDrawer({ open, onClose }: Props) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

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

        {/* In Progress */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Clock3 size={16} />
            <span>In progress</span>
          </div>
          {mockInProgress.length === 0 ? (
            <div className={styles.empty}>No active transactions.</div>
          ) : (
            <ul className={styles.list}>
              {mockInProgress.map((tx) => (
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
                    <button className={styles.hashBtn} title='Open in explorer'>
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
          <ul className={styles.list}>
            {mockHistory.map((tx) => (
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
                  <button className={styles.hashBtn} title='Open in explorer'>
                    <span>{tx.hash}</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </>
  );
}
