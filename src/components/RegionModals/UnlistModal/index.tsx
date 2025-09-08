'use client';

import React, { useEffect, useState } from 'react';
import styles from './unlist-modal.module.scss';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';

interface UnlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnlistModal: React.FC<UnlistModalProps> = ({ isOpen, onClose }) => {
  const selectedAccount = useUnit($selectedAccount);

  const [currentPrice, setCurrentPrice] = useState<string>('123.45');
  const [receptionist, setReceptionist] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setReceptionist(selectedAccount?.address ?? '');
    } else {
    }
  }, [isOpen, selectedAccount]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  const onUnlist = () => {
    toast.success('Not supported yet');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Unlist region</h2>
          <button className={styles.closeIcon} onClick={onClose} aria-label='Close'>
            <X size={16} />
          </button>
        </div>

        <p className={styles.subText}>This will remove the region from the marketplace.</p>

        <div className={styles.infoGroup}>
          <label className={styles.infoLabel}>Current price</label>
          <div className={styles.infoField}>{currentPrice || '—'}</div>
        </div>

        <div className={styles.infoGroup}>
          <label className={styles.infoLabel}>Sale receptionist</label>
          <div className={styles.infoField} title={receptionist}>
            {receptionist || '—'}
          </div>
        </div>

        <button className={styles.unlistBtn} onClick={onUnlist}>
          Unlist from market
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default UnlistModal;
