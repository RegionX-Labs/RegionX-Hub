import React, { useState } from 'react';
import styles from './TransferToMarketplaceModal.module.scss';
import { X } from 'lucide-react';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import { $accountData, MultiChainAccountData } from '@/account';
import { $network } from '@/api/connection';
import TransactionModal from '@/components/TransactionModal';
import toast, { Toaster } from 'react-hot-toast';
import { RegionId } from '@/utils';
import Image from 'next/image';
import {
  PolkadotCoretime,
  KusamaCoretime,
  PaseoCoretime,
  WestendCoretime,
} from '@/assets/networks';

interface Props {
  isOpen: boolean;
  regionId: RegionId;
  onClose: () => void;
}

const TransferToMarketplaceModal: React.FC<Props> = ({ isOpen, regionId, onClose }) => {
  const accountData = useUnit($accountData);
  const selectedAccount = useUnit($selectedAccount);
  const network = useUnit($network);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    toast.success('Pretend transfer to RegionX initiated');
    setIsModalOpen(false);
  };

  const getFormattedSource = () => {
    return `${network.charAt(0).toUpperCase() + network.slice(1)} Coretime`;
  };

  const getNetworkIcon = () => {
    switch (network) {
      case 'polkadot':
        return PolkadotCoretime.src;
      case 'kusama':
        return KusamaCoretime.src;
      case 'paseo':
        return PaseoCoretime.src;
      case 'westend':
        return WestendCoretime.src;
      default:
        return '/icons/default-network.svg';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Transfer to Marketplace Chain</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>
          This action moves your region from the Coretime chain to the RegionX chain.
          <br />
          It will not be listed for sale automatically.
        </p>

        <div className={styles.visualRepresentation}>
          <div className={styles.chainBox}>
            <div className={styles.iconLabelWrapper}>
              <Image src={getNetworkIcon()} alt='network icon' width={20} height={20} />
              <span>{getFormattedSource()}</span>
            </div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.chainBox}>
            <div className={styles.regionxLabelWrapper}>
              <Image src='/favicon.ico' alt='RegionX icon' width={20} height={20} />
              <span>RegionX</span>
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

        <button className={styles.transferBtn} onClick={openModal}>
          Transfer now
        </button>

        <Toaster />
      </div>
    </div>
  );
};

export default TransferToMarketplaceModal;
