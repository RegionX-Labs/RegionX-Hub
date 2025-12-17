'use client';

import { useEffect } from 'react';
import styles from './ActivityDrawer.module.scss';
import { X, Bell, Clock3 } from 'lucide-react';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { ActivityItem } from './ActivityItem';
import { useActivityData } from './useActivityData';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ActivityDrawer({ open, onClose }: Props) {
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const { inProgress, history, loading, statusMessage } = useActivityData({
    open,
    network,
    address: selectedAccount?.address ?? null,
  });

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  const emptyInProgress = !loading && inProgress.length === 0;
  const emptyHistory = !loading && history.length === 0;

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
                    <ActivityItem key={tx.id} tx={tx} />
                  ))}
                </ul>
              )}
            </section>

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
                    <ActivityItem key={tx.id} tx={tx} />
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
