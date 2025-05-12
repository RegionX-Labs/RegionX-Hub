import React from 'react';
import styles from './transaction-modal.module.scss';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const relayBalance = '12.345 DOT';
  const coretimeBalance = '5.678 DOT';
  const txFee = '0.002 DOT';

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
          Relay Chain Balance: <span>{relayBalance}</span>
        </p>
        <p className={styles.balance}>
          Coretime Balance: <span>{coretimeBalance}</span>
        </p>
        <p className={styles.balance}>
          Transaction Fee: <span>{txFee}</span>
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
