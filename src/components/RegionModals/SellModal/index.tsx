import React, { useState, useEffect } from 'react';
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

const SellModal: React.FC<SellModalProps> = ({ isOpen, regionId, onClose }) => {
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');

  const selectedAccount = useUnit($selectedAccount);
  const network = useUnit($network);
  const connections = useUnit($connections);

  useEffect(() => {
    if (isOpen && selectedAccount?.address) {
      setAddress(selectedAccount.address);
    }
  }, [isOpen, selectedAccount]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const onSell = () => {
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
