import React, { useState } from 'react';
import styles from './transfer-modal.module.scss';
import AddressInput from '../../elements/AdressInput/AddressInput';
import { ArrowDown, X } from 'lucide-react';
import { useUnit } from 'effector-react';
import { $selectedAccount, WalletAccount } from '@/wallet';
import Identicon from '@polkadot/react-identicon';
import { $accountData, getAccountData, MultiChainAccountData } from '@/account';
import { $connections, $network } from '@/api/connection';
import toast, { Toaster } from 'react-hot-toast';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { RegionId } from '@/utils';
import TransactionModal from '@/components/TransactionModal';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';
import { RegionLocation } from '@/coretime/regions';

interface TransferModalProps {
  isOpen: boolean;
  regionId: RegionId;
  regionLocation: RegionLocation;
  onClose: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  regionId,
  regionLocation,
  onClose,
}) => {
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
    await transfer();
    setIsModalOpen(false);
  };

  const transfer = async () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    if (!destination) {
      toast.error('Destination not set');
      return;
    }

    if (regionLocation === RegionLocation.CoretimeChain) {
      transferOnCoretimeChain(selectedAccount, destination);
    } else if (regionLocation === RegionLocation.RegionxChain) {
      transferOnRegionxChain(selectedAccount, destination);
    }
  };

  const transferOnCoretimeChain = async (account: WalletAccount, new_owner: string) => {
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
      new_owner,
    });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(account.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(
          <span>
            Transaction submitted:&nbsp;
            <a
              href={`${SUBSCAN_CORETIME_URL[network]}/extrinsic/${ev.txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: 'underline', color: '#60a5fa' }}
            >
              view transaction
            </a>
          </span>,
          { id: toastId }
        );
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed', { id: toastId });
            console.log(err);
          } else {
            toast.success('Transaction succeded!', { id: toastId });
            getAccountData({ account: account.address, connections, network });
          }
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
  };

  const transferOnRegionxChain = async (account: WalletAccount, new_owner: string) => {
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds || !networkChainIds.regionxChain) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.regionxChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata || !metadata.regionxChain) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    const tx = client.getTypedApi(metadata.regionxChain).tx.Regions.transfer({
      region_id: regionId,
      new_owner,
    });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(account.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(<span>Transaction submitted</span>, { id: toastId });
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed', { id: toastId });
            console.log(err);
          } else {
            toast.success('Transaction succeded!', { id: toastId });
            getAccountData({ account: account.address, connections, network });
          }
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
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0' }}>
              <ArrowDown className={styles.arrowIcon} />
            </div>
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
