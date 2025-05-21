import React, { useState } from 'react';
import styles from './sell-modal.module.scss';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellModal: React.FC<SellModalProps> = ({ isOpen, onClose }) => {
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const onSell = () => {
    toast.error("Not supported yet");
  }

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>List on sale</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>Choose price and address for your listing.</p>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Price</label>
          <input
            type='text'
            placeholder='Add Price'
            className={styles.inputField}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Address</label>
          <input
            type='text'
            placeholder='Add Address'
            className={styles.inputField}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button className={styles.assignBtn} onClick={onSell}>
          List on sale
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default SellModal;
