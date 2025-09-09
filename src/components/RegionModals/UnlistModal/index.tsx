'use client';

import React from 'react';
import styles from './unlist-modal.module.scss';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import { RegionId } from '@/utils';

interface UnlistModalProps {
  isOpen: boolean;
  regionId: RegionId;
  onClose: () => void;
}

const UnlistModal: React.FC<UnlistModalProps> = ({ isOpen, regionId, onClose }) => {
  const selectedAccount = useUnit($selectedAccount);
  const connections = useUnit($connections);
  const network = useUnit($network);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  const onUnlist = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds || !networkChainIds.regionxChain) return toast.error('Unknown network');
    const connection = connections[networkChainIds.regionxChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata || !metadata.regionxChain)
      return toast.error('Connection or metadata missing');

    const tx = connection.client.getTypedApi(metadata.regionxChain).tx.Market.unlist_region({
      region_id: regionId,
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
          <h2>Unlist region</h2>
          <button className={styles.closeIcon} onClick={onClose} aria-label='Close'>
            <X size={16} />
          </button>
        </div>

        <p className={styles.subText}>This will remove the region from the marketplace.</p>

        <button className={styles.unlistBtn} onClick={onUnlist}>
          Unlist from market
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default UnlistModal;
