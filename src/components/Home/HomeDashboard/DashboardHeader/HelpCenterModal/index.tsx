'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './HelpCenterModal.module.scss';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
}

const helpContent: Record<string, string[]> = {
  Overview: [
    'Welcome to the Overview dashboard.',
    'This page gives a summary of parachain activity and performance.',
    'You can check auction phases, remaining cores, and recent purchases.',
  ],
  'Deploying a new project': [
    'Step 1: Select and purchase cores from the Dutch Auction.',
    'Step 2: Wait for your parachain to be scheduled after successful purchase.',
    'Step 3: Launch your parachain once ready.',
  ],
  'Managing Existing Project': [
    'Restore a core by selecting your Para ID and clicking "Renew".',
    'You can compare renewal pricing and interlude timing.',
    'Ensure your renewal is submitted before the interlude ends.',
  ],
};

export default function HelpCenterModal({ isOpen, onClose, selected }: HelpCenterModalProps) {
  const [page, setPage] = useState(0);
  const content = helpContent[selected] || ['No help content available.'];

  useEffect(() => {
    if (isOpen) {
      setPage(0);
    }
  }, [isOpen, selected]);

  const next = () => setPage((p) => (p + 1) % content.length);
  const prev = () => setPage((p) => (p - 1 + content.length) % content.length);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Help Center</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <div className={styles.helpBody}>
          <p>{content[page]}</p>
        </div>

        <div className={styles.pagination}>
          <button onClick={prev} disabled={content.length <= 1}>
            Previous
          </button>
          <span>
            {page + 1} / {content.length}
          </span>
          <button onClick={next} disabled={content.length <= 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
