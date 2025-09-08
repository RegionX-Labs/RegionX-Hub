'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './sell-modal.module.scss';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import { RegionId, fromUnit } from '@/utils';

interface SellModalProps {
  isOpen: boolean;
  regionId: RegionId;
  onClose: () => void;
}

const sanitizeNumberInput = (raw: string) => {
  let s = raw.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const firstDot = s.indexOf('.');
  if (firstDot !== -1) s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
  return s;
};

const safeParseNumber = (s: string) => {
  if (!s || s === '.') return NaN;
  return Number(s);
};

const SellModal: React.FC<SellModalProps> = ({ isOpen, regionId, onClose }) => {
  const [priceInput, setPriceInput] = useState('');
  const [address, setAddress] = useState('');
  const [priceError, setPriceError] = useState<string | null>(null);

  const selectedAccount = useUnit($selectedAccount);
  const network = useUnit($network);
  const connections = useUnit($connections);

  useEffect(() => {
    if (isOpen && selectedAccount?.address) setAddress(selectedAccount.address);
    if (!isOpen) {
      setPriceInput('');
      setPriceError(null);
    }
  }, [isOpen, selectedAccount]);

  const parsedValue = useMemo(() => safeParseNumber(priceInput), [priceInput]);

  useEffect(() => {
    if (!priceInput) return setPriceError(' ');
    if (Number.isNaN(parsedValue)) return setPriceError('Invalid number.');
    if (parsedValue <= 0) return setPriceError('Price must be greater than 0.');
    setPriceError(null);
  }, [priceInput, parsedValue]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  const onSell = () => {
    if (priceError) {
      toast.error(priceError);
      return;
    }
    if (!address.trim()) {
      toast.error('Address is required.');
      return;
    }

    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds || !networkChainIds.regionxChain) return toast.error('Unknown network');
    const connection = connections[networkChainIds.regionxChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata || !metadata.regionxChain)
      return toast.error('Connection or metadata missing');

    const tx = connection.client.getTypedApi(metadata.regionxChain).tx.Market.list_region({
      region_id: regionId,
      sale_recipient: selectedAccount.address,
      price_data: fromUnit(network, Number(price)),
    });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(<span>Transaction submitted.</span>, { id: toastId });
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else toast.success('Transaction succeeded!', { id: toastId });
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
  };

  const canSubmit = !priceError && !!address.trim();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>List on sale</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>Enter a fixed token amount.</p>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Price</label>
          <input
            type='text'
            inputMode='decimal'
            pattern='[0-9]*[.,]?[0-9]*'
            placeholder='Add Price'
            className={`${styles.inputField} ${priceError ? styles.inputFieldError : ''}`}
            value={priceInput}
            onChange={(e) => setPriceInput(sanitizeNumberInput(e.target.value))}
            onPaste={(e) => {
              e.preventDefault();
              const text = (e.clipboardData || (window as any).clipboardData).getData('text');
              setPriceInput(sanitizeNumberInput(text));
            }}
          />
          {priceError && <div className={styles.inputError}>{priceError}</div>}
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

        <button className={styles.assignBtn} onClick={onSell} disabled={!canSubmit}>
          List on sale
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default SellModal;
