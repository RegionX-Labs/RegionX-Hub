'use client';

import React, { useEffect } from 'react';
import styles from './raw-data-modal.module.scss';
import { X, Copy } from 'lucide-react';

export interface RawRegionPayload {
  regionId: any;
  coreIndex: number;
  assignedTask: string;
  regionBeginTimeslice: number | undefined;
  regionEndTimeslice: number | undefined;
  durationTimeslices: number | undefined;
  owner: string | null;
  paidRaw: string | bigint | null;
}

interface RawRegionDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: RawRegionPayload;
}

const RawRegionDataModal: React.FC<RawRegionDataModalProps> = ({ isOpen, onClose, payload }) => {
  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyAll = () => navigator.clipboard.writeText(JSON.stringify(payload, null, 2));

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role='dialog'
      aria-modal='true'
      aria-label='Raw region data'
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Raw region data</h2>
          <button aria-label='Close' className={styles.closeIcon} onClick={onClose} type='button'>
            <X size={16} />
          </button>
        </div>

        <p className={styles.subText}>
          Times are expressed in <b>timeslices</b>. Copy JSON for scripts or debugging.
        </p>

        <div className={styles.kvGrid}>
          <div className={styles.kvRow}>
            <span>Core index</span>
            <code>{payload.coreIndex}</code>
          </div>
          <div className={styles.kvRow}>
            <span>Assigned task</span>
            <code>{payload.assignedTask}</code>
          </div>
          <div className={styles.kvRow}>
            <span>Begin (timeslice)</span>
            <code>{payload.regionBeginTimeslice ?? '—'}</code>
          </div>
          <div className={styles.kvRow}>
            <span>End (timeslice)</span>
            <code>{payload.regionEndTimeslice ?? '—'}</code>
          </div>
          <div className={styles.kvRow}>
            <span>Duration (timeslices)</span>
            <code>{payload.durationTimeslices ?? '—'}</code>
          </div>
          <div className={styles.kvRow}>
            <span>Owner</span>
            <code>{payload.owner ?? '—'}</code>
          </div>
          <div className={styles.kvRow}>
            <span>Paid (raw)</span>
            <code>{payload.paidRaw !== null ? String(payload.paidRaw) : '—'}</code>
          </div>
        </div>

        <div className={styles.jsonBlock}>
          <div className={styles.jsonHeader}>
            <span>JSON</span>
            <button className={styles.copyBtn} onClick={copyAll} type='button'>
              <Copy size={14} /> Copy
            </button>
          </div>
          <pre className={styles.pre}>{JSON.stringify(payload, null, 2)}</pre>
        </div>

        <div className={styles.actions}>
          <button className={styles.secondaryBtn} onClick={onClose} type='button'>
            Close
          </button>
          <button className={styles.primaryBtn} onClick={copyAll} type='button'>
            Copy JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default RawRegionDataModal;
