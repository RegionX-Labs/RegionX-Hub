// components/HelpCenterModal.tsx
'use client';

import { X } from 'lucide-react';
import styles from './HelpCenterModal.module.scss';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpCenterModal({ isOpen, onClose }: HelpCenterModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Help Center</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>
        <p>Here you can find helpful information about using the dashboard.</p>
      </div>
    </div>
  );
}
