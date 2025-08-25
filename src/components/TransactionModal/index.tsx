'use client';

import React, { useEffect } from 'react';
import styles from './transaction-modal.module.scss';
import { toUnitFormatted } from '@/utils';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { MultiChainAccountData } from '@/account';
import { X, ShieldCheck, Loader2 } from 'lucide-react';

type Props = {
  isOpen: boolean;
  accountData: MultiChainAccountData;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  estimatedFeeRelay?: bigint;
  note?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
};

const TransactionModal: React.FC<Props> = ({
  isOpen,
  accountData,
  onClose,
  onConfirm,
  title = 'Confirm Transaction',
  subtitle,
  estimatedFeeRelay,
  note,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
}) => {
  const network = useUnit($network);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  const relayFree = toUnitFormatted(network, accountData.relayChainData.free);
  const coretimeFree = toUnitFormatted(network, accountData.coretimeChainData.free);
  const feeFormatted = estimatedFeeRelay ? toUnitFormatted(network, estimatedFeeRelay) : null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.modalContent}
        role='dialog'
        aria-modal='true'
        aria-labelledby='tx-title'
      >
        <button className={styles.closeButton} onClick={onClose} aria-label='Close'>
          <X size={18} />
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <ShieldCheck size={22} />
          </div>
          <div className={styles.titles}>
            <h2 id='tx-title'>{title}</h2>
            {!!subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>Balances</div>
          <div className={styles.balanceGrid}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceLabel}>Relay Chain</div>
              <div className={styles.balanceValue}>{relayFree}</div>
            </div>
            <div className={styles.balanceCard}>
              <div className={styles.balanceLabel}>Coretime Chain</div>
              <div className={styles.balanceValue}>{coretimeFree}</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>Summary</div>
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>Estimated Fee (Relay)</span>
              <span className={styles.valueMono}>{feeFormatted ?? '—'}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow}>
              <span>Status</span>
              <span className={styles.statusPill}>Ready</span>
            </div>
          </div>
        </div>

        {!!note && <div className={styles.note}>{note}</div>}

        <div className={styles.actions}>
          <button className={styles.ghostBtn} onClick={onClose} disabled={loading}>
            {cancelLabel}
          </button>
          <button className={styles.primaryBtn} onClick={onConfirm} disabled={disabled || loading}>
            {loading ? <Loader2 className={styles.spinner} size={18} /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
