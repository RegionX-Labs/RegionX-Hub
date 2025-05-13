import React, { useState } from 'react';
import styles from './assign-modal.module.scss';
import { X } from 'lucide-react';
import Select from '@/components/elements/Select';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FinalityOption {
  label: string;
  value: string;
  description: string;
}

const finalityOptions: FinalityOption[] = [
  {
    label: 'Assign with Final finality',
    value: 'final',
    description:
      'This means your region will be permanently assigned to a specific task.\n\nNo further modifications can be made to the region, which is why it will no longer appear on the regions page.\n\nThe benefit of choosing this option is that others can be confident that the Coretime cannot be unassigned from the task.\n\nAnother key benefit is that this option allows you to renew your core.',
  },
  {
    label: 'Assign with Provisional finality',
    value: 'provisional',
    description:
      'This means that after assigning the region to a specific task, you retain the option to unassign and reassign it to another task at any time.\n\nThe benefit is flexibility—you can manage your region at any time.\n\nHowever, others cannot be certain that the Coretime will remain assigned.',
  },
];

const AssignModal: React.FC<AssignModalProps> = ({ isOpen, onClose }) => {
  const [taskId, setTaskId] = useState('');
  const [selectedFinality, setSelectedFinality] = useState<FinalityOption | null>(
    finalityOptions[0]
  );

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const formatDescription = (desc: string) =>
    desc.split('\n\n').map((para, idx) => (
      <p key={idx} className={styles.finalityDescription}>
        {para}
      </p>
    ));

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Assign</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>Select the task ID to assign</p>

        <div className={styles.inputs}>
          <div className={styles.inputRow}>
            <label className={styles.inputLabel}>Task ID</label>
            <input
              type='text'
              placeholder='Add ID'
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className={styles.fromInput}
            />
          </div>

          <div className={styles.inputRow}>
            <label className={styles.inputLabel}>Finality Type</label>
            <div className={styles.selectWrapper}>
              <Select
                options={finalityOptions.map((opt) => ({
                  key: opt.value,
                  label: opt.label,
                  value: opt,
                }))}
                selectedValue={selectedFinality}
                onChange={(val) => val && setSelectedFinality(val)}
              />
            </div>
          </div>

          {selectedFinality && formatDescription(selectedFinality.description)}
        </div>

        <button className={styles.assignBtn}>Assign now</button>
      </div>
    </div>
  );
};

export default AssignModal;
