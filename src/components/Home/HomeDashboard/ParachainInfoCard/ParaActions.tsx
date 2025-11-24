import toast, { Toaster } from 'react-hot-toast';
import styles from './ParachainInfoCard.module.scss';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import { useEffect, useMemo, useState } from 'react';
import { RenewalKey, RenewalRecord } from '@/coretime/renewals';
import { $connections, $network } from '@/api/connection';
import { $accountData, MultiChainAccountData } from '@/account';
import AutoRenewalModal from '@/components/AutoRenewalModal';
import TransactionModal from '@/components/TransactionModal';
import { ParaState } from '@/components/ParaStateCard';
import { getParaCoreId } from '@/parachains';
import { renew } from '@/utils/transactions/renew';
import { $latestSaleInfo, fetchCoresSold } from '@/coretime/saleInfo';
import { SOLD_OUT_MESSAGE } from '@/utils';

interface Props {
  paraId?: number;
  paraState?: ParaState;
  renewalEntry: [RenewalKey, RenewalRecord] | null;
  parasWithAutoRenewal: Set<number>;
}

export const ParaActions = ({ paraId, paraState, renewalEntry, parasWithAutoRenewal }: Props) => {
  const selectedAccount = useUnit($selectedAccount);
  const accountData = useUnit($accountData);
  const network = useUnit($network);
  const connections = useUnit($connections);
  const saleInfo = useUnit($latestSaleInfo);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoRenewOpen, setIsAutoRenewOpen] = useState(false);
  const [paraCore, setParaCore] = useState<number | null>(null);
  const [coresSold, setCoresSold] = useState<number | null>(null);

  useEffect(() => {
    if (!paraId) return;
    (async () => {
      const core = await getParaCoreId(paraId, connections, network);
      const coresSold = await fetchCoresSold(network, connections);
      setParaCore(core);
      setCoresSold(coresSold);
    })();
  }, [paraId, network, connections]);

  const openModal = () => {
    if (!selectedAccount) return toast.error('Account not selected');
    if (!renewalEntry) return toast.error('No renewal available');
    if (!saleInfo) return toast.error('Sale info not available');
    if (!coresSold) return toast.error('Failed to fetch availability of cores');

    const selectedAccountData = accountData[selectedAccount.address];
    if (!selectedAccountData?.coretimeChainData) {
      return toast.error('Account data unavailable');
    }
    const freeBalance = selectedAccountData.coretimeChainData.free;
    const required = BigInt(renewalEntry[1].price);
    if (freeBalance < required) {
      return toast.error('Insufficient coretime balance for renewal');
    }

    if (coresSold >= saleInfo.coresOffered) return toast.error(SOLD_OUT_MESSAGE);
    setIsModalOpen(true);
  };

  const autoRenewEnabled = useMemo(() => {
    if (!paraId) return false;
    return parasWithAutoRenewal.has(Number(paraId));
  }, [parasWithAutoRenewal, paraId]);

  const onModalConfirm = async () => {
    if (!renewalEntry || !selectedAccount) return;
    const [key] = renewalEntry;

    await renew(network, connections, selectedAccount, key.core);
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

      {paraCore !== null && paraId && (
        <AutoRenewalModal
          isOpen={isAutoRenewOpen}
          onClose={() => setIsAutoRenewOpen(false)}
          paraId={paraId}
          coreId={paraCore}
        />
      )}

      <Toaster />
    </div>
  );
};
