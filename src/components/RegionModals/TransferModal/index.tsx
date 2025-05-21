import React, { useState } from 'react';
import styles from './transfer-modal.module.scss';
import AddressInput from '../../elements/AdressInput/AddressInput';
import { ArrowDown, X } from 'lucide-react';
import Image from 'next/image';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import Identicon from '@polkadot/react-identicon';
import { $accountData, getAccountData, MultiChainAccountData } from '@/account';
import { $connections, $network } from '@/api/connection';
import toast, { Toaster } from 'react-hot-toast';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { RegionId } from '@/utils';
import TransactionModal from '@/components/TransactionModal';

interface TransferModalProps {
  isOpen: boolean;
  regionId: RegionId;
  onClose: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, regionId, onClose }) => {
  const accountData = useUnit($accountData);
  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);

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
    await assign();
    setIsModalOpen(false);
  };

  const assign = async () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    if (!destination) {
      toast.error('Destination not set');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.transfer({
      region_id: regionId,
      new_owner: destination,
    });
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed');
            console.log(err);
          } else {
            toast.success('Transaction succeded!');
            getAccountData({ account: selectedAccount.address, connections, network });
          }
        }
      },
      (e) => {
        toast.error('Transaction cancelled');
        console.log(e);
      }
    );
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
              <AddressInput
                placeholder='Add Address'
                value={destination || ''}
                onChange={(e) => setDestination(e.target.value)}
              />
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

export default TransferModal;
