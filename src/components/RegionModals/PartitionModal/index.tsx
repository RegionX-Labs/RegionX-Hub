import React, { useState, useEffect } from 'react';
import styles from './partition-modal.module.scss';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $accountData, MultiChainAccountData } from '@/account';
import { $connections, $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { timesliceToTimestamp } from '@/utils';
import TransactionModal from '@/components/TransactionModal';

interface PartitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  regionBeginTimeslice: number;
  regionEndTimeslice: number;
}

const PartitionModal: React.FC<PartitionModalProps> = ({
  isOpen,
  onClose,
  regionBeginTimeslice,
  regionEndTimeslice,
}) => {
  const accountData = useUnit($accountData);
  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [percentage, setPercentage] = useState(50);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [splitDate, setSplitDate] = useState('');

  useEffect(() => {
    const loadDates = async () => {
      const beginTs = await timesliceToTimestamp(regionBeginTimeslice, network, connections);
      const endTs = await timesliceToTimestamp(regionEndTimeslice, network, connections);

      if (beginTs && endTs) {
        const begin = Number(beginTs);
        const end = Number(endTs);

        const format = (ts: number) =>
          new Date(ts).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
          });

        setStartDate(format(begin));
        setEndDate(format(end));

        const updateSplit = (pct: number) => {
          const splitTs = begin + ((end - begin) * pct) / 100;
          setSplitDate(format(splitTs));
        };

        updateSplit(percentage);
      }
    };

    if (isOpen) loadDates();
  }, [isOpen, percentage, regionBeginTimeslice, regionEndTimeslice, network, connections]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = Number(e.target.value);
    setPercentage(newPercentage);

    const begin = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const splitTs = begin + ((end - begin) * newPercentage) / 100;

    const formatted = new Date(splitTs).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
    });

    setSplitDate(formatted);
  };

  const normalized = (percentage / 100) * 100;

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
          With partitioning, a region can be split into two new non-overlapping regions.
          <br />
          <br />
          For example, a region purchased from the bulk sale with a duration of 28 days can be
          partitioned into two new regions, each with a duration of 14 days. One will be valid for
          the first 14 days, and the other for the remaining 14 days.
        </p>

        <label className={styles.inputLabel}>Select the split point</label>

        <div className={styles.partitionSliderWrapper}>
          <div className={styles.dateLabels}>
            <span>{startDate}</span>
            <span>{endDate}</span>
          </div>

          <div className={styles.sliderWrapper}>
            <input
              type='range'
              min={0}
              max={100}
              value={percentage}
              onChange={handleSliderChange}
              className={styles.partitionSlider}
            />
            <div className={styles.percentageLabel} style={{ left: `${normalized}%` }}>
              {splitDate}
            </div>
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
        <button className={styles.assignBtn} onClick={openModal}>
          Partition
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default PartitionModal;
