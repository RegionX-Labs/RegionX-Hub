import React from 'react';
import styles from './transaction-modal.module.scss';
import { toUnitFormatted } from '@/utils';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { MultiChainAccountData } from '@/account';

interface TransactionModalProps {
  isOpen: boolean;
  accountData: MultiChainAccountData;
  onClose: () => void;
  onConfirm: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  accountData,
  onClose,
  onConfirm,
}) => {
  const network = useUnit($network);
  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Transaction</h2>

        <p className={styles.balance}>
          Relay Chain Balance:{' '}
          <span>{toUnitFormatted(network, accountData.relayChainData.free)}</span>
        </p>
        <p className={styles.balance}>
          Coretime Chain Balance:{' '}
          <span>{toUnitFormatted(network, accountData.coretimeChainData.free)}</span>
        </p>

        <p className={styles.question}>Do you want to proceed with the transaction?</p>
        <div className={styles.actions}>
          <button className={styles.noBtn} onClick={onClose}>
            No
          </button>
          <button className={styles.yesBtn} onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
