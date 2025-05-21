import React, { useState } from 'react';
import styles from './partition-modal.module.scss';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $accountData, MultiChainAccountData } from '@/account';
import { $connections, $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import TransactionModal from '@/components/TransactionModal';

interface PartitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PartitionModal: React.FC<PartitionModalProps> = ({ isOpen, onClose }) => {
  const min = 1;
  const max = 100;

  const accountData = useUnit($accountData);
  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [percentage, setPercentage] = useState(50);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const normalized = ((percentage - min) / (max - min)) * 100;

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    await partition();
    setIsModalOpen(false);
  };

  const partition = async () => {
    // TODO
    toast.error('Not supported yet');
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Partition</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>
          {' '}
          With partitioning, a region can be split into two new non-overlapping regions. For
          example, a region purchased from the bulk sale with a duration of 28 days can be
          partitioned into two new regions, each with a duration of 14 days. One will be valid for
          the first 14 days, and the other for the remaining 14 days.
        </p>
        <label className={styles.inputLabel}>Select on the split point</label>

        <div className={styles.partitionSliderWrapper}>
          <input
            type='range'
            min={min}
            max={max}
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className={styles.partitionSlider}
            style={{ '--percentage': `${normalized}%` } as React.CSSProperties}
          />
          <div className={styles.percentageLabel} style={{ left: `${normalized}%` }}>
            {percentage}%
          </div>
        </div>

        {selectedAccount && accountData[selectedAccount.address] !== null && (
          <TransactionModal
            isOpen={isModalOpen}
            accountData={accountData[selectedAccount.address] as MultiChainAccountData}
            onClose={() => setIsModalOpen(false)}
            onConfirm={onModalConfirm}
          />
        )}
        <button className={styles.assignBtn} onClick={partition}>
          Partition
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default PartitionModal;
