import React from 'react';
import styles from './transfer-modal.module.scss';
import AddressInput from '../../elements/AdressInput/AddressInput';
import { ArrowDown, X } from 'lucide-react';
import Image from 'next/image';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import Identicon from '@polkadot/react-identicon';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const selectedAccount = useUnit($selectedAccount);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Transfer</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>
        <p className={styles.subText}>Send the coretime to another user</p>

        <div className={styles.inputs}>
          <div className={styles.inputRow}>
            <label className={styles.inputLabel}>From</label>
            <div className={styles.identityInputWrapper}>
              {selectedAccount?.address && (
                <Identicon
                  value={selectedAccount.address}
                  size={22}
                  theme='polkadot'
                  className={styles.identiconInside}
                />
              )}
              <input
                type='text'
                value={selectedAccount?.address || ''}
                readOnly
                className={selectedAccount?.address ? styles.fromInputWithIcon : styles.fromInput}
                placeholder={!selectedAccount?.address ? 'Account not seleceted' : ''}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'left', margin: '10px 0' }}>
            <Image
              src='/ArrowDown.svg'
              alt='Arrow Down'
              width={20}
              height={20}
              className={styles.arrowIcon}
            />
          </div>
          <div className={styles.inputRow}>
            <label className={styles.inputLabel}>To</label>
            <div className={`${styles.beneficiaryInputWrapper} ${styles.addressInput}`}>
              <AddressInput placeholder='Add Address' />
            </div>
          </div>
        </div>

        <button className={styles.transferBtn}>Transfer now</button>
      </div>
    </div>
  );
};

export default TransferModal;
