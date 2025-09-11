import toast, { Toaster } from 'react-hot-toast';
import styles from './ParachainInfoCard.module.scss';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import { useMemo, useState } from 'react';
import { RenewalKey, RenewalRecord } from '@/coretime/renewals';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';
import AutoRenewalModal from '@/components/AutoRenewalModal';
import TransactionModal from '@/components/TransactionModal';
import { ParaState } from '@/components/ParaStateCard';

interface Props {
  paraId?: number;
  paraState?: ParaState;
  parasWithAutoRenewal: Set<number>;
}

export const ParaActions = ({ paraId, paraState, parasWithAutoRenewal }: Props) => {
  const selectedAccount = useUnit($selectedAccount);
  const accountData = useUnit($accountData);
  const network = useUnit($network);
  const connections = useUnit($connections);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoRenewOpen, setIsAutoRenewOpen] = useState(false);
  const [renewalEntry, setRenewalEntry] = useState<[RenewalKey, RenewalRecord] | null>(null);

  const openModal = () => {
    if (!selectedAccount) return toast.error('Account not selected');
    if (!renewalEntry) return toast.error('No renewal available');
    setIsModalOpen(true);
  };

  const autoRenewEnabled = useMemo(() => {
    if (!paraId) return false;
    return parasWithAutoRenewal.has(Number(paraId));
  }, [parasWithAutoRenewal, paraId]);

  const onModalConfirm = async () => {
    if (!renewalEntry || !selectedAccount) return;
    const [key] = renewalEntry;

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');

    const connection = connections[networkChainIds.coretimeChain];
    const client = connection?.client;
    const metadata = getNetworkMetadata(network);
    if (!client || !metadata) return toast.error('API error');

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.renew({ core: key.core });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev: any) => {
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
          if (ev.ok) {
            toast.success('Renewal successful', { id: toastId });
            getAccountData({ account: selectedAccount.address, connections, network });
          } else {
            toast.error('Transaction failed', { id: toastId });
          }
        }
      },
      () => {
        toast.error('Transaction error', { id: toastId });
      }
    );

    setIsModalOpen(false);
  };

  return (
    <div className={styles.actionRow}>
      <div className={styles.leftAction}>
        {renewalEntry && (
          <button className={styles.renewButton} onClick={openModal}>
            Renew
          </button>
        )}
      </div>
      <div className={styles.rightAction}>
        {paraState !== ParaState.SYSTEM && paraId && (
          <button
            className={
              autoRenewEnabled
                ? `${styles.autoRenewBtn} ${styles.autoRenewBtnEnabled}`
                : styles.autoRenewBtn
            }
            onClick={() => setIsAutoRenewOpen(true)}
          >
            {autoRenewEnabled ? 'Auto-Renewal Enabled' : 'Enable Auto-Renewal'}
          </button>
        )}
      </div>

      {selectedAccount && accountData[selectedAccount.address] && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onModalConfirm}
        />
      )}

      {renewalEntry && paraId && (
        <AutoRenewalModal
          isOpen={isAutoRenewOpen}
          onClose={() => setIsAutoRenewOpen(false)}
          paraId={paraId}
          coreId={renewalEntry[0].core}
        />
      )}

      <Toaster />
    </div>
  );
};
