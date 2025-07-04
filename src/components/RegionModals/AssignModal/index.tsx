import React, { useState } from 'react';
import styles from './assign-modal.module.scss';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import { $accountData, getAccountData, MultiChainAccountData } from '@/account';
import TransactionModal from '@/components/TransactionModal';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import { RegionId } from '@/utils';
import { Enum } from 'polkadot-api';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';

type Finality = Enum<{
  Provisional: undefined;
  Final: undefined;
}>;

interface AssignModalProps {
  isOpen: boolean;
  regionId: RegionId;
  onClose: () => void;
}

interface FinalityOption {
  label: string;
  value: string;
  description: string;
}

const finalityOptions: FinalityOption[] = [
  {
    label: 'Assign with Final finality',
    value: 'final',
    description:
      'This means your region will be permanently assigned to a specific task.\n\nNo further modifications can be made to the region, which is why it will no longer appear on the regions page.\n\nBy choosing this option others can be confident that the Coretime cannot be unassigned from the task.\n\nAlso, with Final finality, the core becomes eligible for renewal.',
  },
  {
    label: 'Assign with Provisional finality',
    value: 'provisional',
    description:
      'This means that after assigning the region to a specific task, you retain the option to unassign and reassign it to another task at any time.\n\nThe benefit is flexibility—you can manage your region at any time.\n\nHowever, others cannot be certain that the Coretime will remain assigned.',
  },
];

const AssignModal: React.FC<AssignModalProps> = ({ isOpen, regionId, onClose }) => {
  const accountData = useUnit($accountData);
  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const [taskId, setTaskId] = useState('');
  const [selectedFinality, setSelectedFinality] = useState<FinalityOption | null>(
    finalityOptions[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const formatDescription = (desc: string) =>
    desc.split('\n\n').map((para, idx) => (
      <p key={idx} className={styles.finalityDescription}>
        {para}
      </p>
    ));

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

    if (!selectedFinality) {
      toast.error('Finality not selected');
      return;
    }

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.assign({
      region_id: regionId,
      finality: {
        type: selectedFinality.value === 'final' ? 'Final' : 'Provisional',
        value: undefined,
      },
      task: Number(taskId),
    });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
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
            getAccountData({ account: selectedAccount.address, connections, network });
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
          <h2>Assign</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>Select the task ID to assign</p>

        <div className={styles.inputs}>
          <div className={styles.inputRow}>
            <label className={styles.inputLabel}>Task ID</label>
            <input
              type='text'
              placeholder='Add ID'
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className={styles.fromInput}
            />
          </div>

          <div className={styles.inputRow}>
            <label className={styles.inputLabel}>Select</label>
            {finalityOptions.map((option) => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type='radio'
                  name='finality'
                  value={option.value}
                  checked={selectedFinality?.value === option.value}
                  onChange={() => setSelectedFinality(option)}
                />
                <span className={styles.radioLabel}>{option.label}</span>
              </label>
            ))}
          </div>

          {selectedFinality && formatDescription(selectedFinality.description)}
        </div>
        {selectedAccount && accountData[selectedAccount.address] !== null && (
          <TransactionModal
            isOpen={isModalOpen}
            accountData={accountData[selectedAccount.address] as MultiChainAccountData}
            onClose={() => setIsModalOpen(false)}
            onConfirm={onModalConfirm}
          />
        )}
        <button className={styles.assignBtn} onClick={openModal}>
          Assign now
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default AssignModal;
