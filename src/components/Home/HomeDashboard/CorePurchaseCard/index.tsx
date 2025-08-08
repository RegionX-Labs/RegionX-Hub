'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, fetchCoresSold, getCurrentPhase, SalePhase } from '@/coretime/saleInfo';
import { purchaseHistoryRequested } from '@/coretime/purchaseHistory';
import { $connections, $network } from '@/api/connection';
import { getCorePriceAt, toUnitFormatted } from '@/utils';
import styles from './CorePurchaseCard.module.scss';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';
import { $selectedAccount } from '@/wallet';
import TransactionModal from '@/components/TransactionModal';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';

type Props = {
  view?: string;
};

export default function CorePurchaseCard({ view }: Props) {
  const [accountData, connections, network, saleInfo, selectedAccount] = useUnit([
    $accountData,
    $connections,
    $network,
    $latestSaleInfo,
    $selectedAccount,
  ]);

  const [corePrice, setCorePrice] = useState<number | null>(null);
  const [coresSold, setCoresSold] = useState<number>(0);
  const [currentHeight, setCurrentHeight] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<SalePhase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buyMultiple, setBuyMultiple] = useState(false);
  const [numCores, setNumCores] = useState<number | null>(null);

  useEffect(() => {
    if (network && saleInfo) {
      (async () => {
        const networkChainIds = getNetworkChainIds(network);

        if (!networkChainIds) return null;
        const connection = connections[networkChainIds.relayChain];
        if (!connection || !connection.client || connection.status !== 'connected') return null;

        const client = connection.client;
        const metadata = getNetworkMetadata(network);
        if (!metadata) return;

        purchaseHistoryRequested({
          network,
          saleCycle: saleInfo.saleCycle,
        });

        const currentBlockNumber = await client
          .getTypedApi(metadata.relayChain)
          .query.System.Number.getValue();
        setCurrentHeight(currentBlockNumber);
        const price = getCorePriceAt(currentBlockNumber, saleInfo, network);
        setCorePrice(price);
        const sold = await fetchCoresSold(network, connections);
        setCoresSold(sold || 0);
      })();
    }
  }, [saleInfo?.network, connections]);

  useEffect(() => {
    (async () => {
      if (!saleInfo) return;
      const networkChainIds = getNetworkChainIds(network);
      if (!networkChainIds) return;

      const connection = connections[networkChainIds.relayChain];
      if (!connection || !connection.client || connection.status !== 'connected') return;

      const client = connection.client;
      const metadata = getNetworkMetadata(network);
      if (!metadata) return;

      const currentBlockNumber = await client
        .getTypedApi(metadata.relayChain)
        .query.System.Number.getValue();
      const phase = getCurrentPhase(saleInfo, currentBlockNumber);
      setCurrentPhase(phase);
    })();
  }, [network, saleInfo]);

  const coresOffered = saleInfo?.coresOffered ?? 0;
  const coresRemaining = coresOffered - coresSold;

  const openModal = () => {
    if (!selectedAccount) return toast.error('Account not selected');
    if (currentPhase === SalePhase.Interlude)
      return toast.error('Cannot purchase during interlude');
    if (coresRemaining === 0) return toast.error('No more cores remaining');
    if (buyMultiple && (numCores === null || numCores <= 0 || numCores > coresRemaining)) {
      return toast.error(`Enter a valid number of cores (1–${coresRemaining})`);
    }
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    await buyCore();
    setIsModalOpen(false);
  };

  const buyCore = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    if (!corePrice) return toast.error('Failed to fetch the price of a core');

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');

    const connection = connections[networkChainIds.coretimeChain];
    if (!connection?.client || connection.status !== 'connected') {
      return toast.error('Failed to connect to the API');
    }

    const metadata = getNetworkMetadata(network);
    if (!metadata) return toast.error('Failed to find metadata');

    const api = connection.client.getTypedApi(metadata.coretimeChain);
    const times = buyMultiple ? Math.min(numCores ?? 0, coresRemaining) : 1;

    const calls = Array.from(
      { length: times },
      () => api.tx.Broker.purchase({ price_limit: BigInt(corePrice) }).decodedCall
    );

    const tx =
      times === 1
        ? api.tx.Broker.purchase({ price_limit: BigInt(corePrice) })
        : api.tx.Utility.batch({ calls });

    const toastId = toast.loading('Submitting transaction...');
    await new Promise<void>((resolve) => {
      tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
        (ev) => {
          if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
            if (!ev.ok) {
              toast.error('Transaction failed', { id: toastId });
              console.error(ev.dispatchError);
            } else {
              toast.success('Transaction succeeded!', { id: toastId });
              getAccountData({ account: selectedAccount.address, connections, network });
            }
            resolve();
          }
        },
        (e) => {
          toast.error('Transaction cancelled', { id: toastId });
          console.error(e);
          resolve();
        }
      );
    });
  };

  return (
    <div
      className={`${styles.coreRemainingCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <p className={styles.title}>Cores Offered</p>
      <h2 className={styles.value}>{saleInfo ? coresOffered : '—'}</h2>
      <p className={styles.title}>Cores Remaining</p>
      <h2 className={styles.value}>{saleInfo ? coresRemaining : '—'}</h2>

      <div className={styles.row}>
        <span className={styles.label}>
          {currentHeight < (saleInfo?.saleStart ?? 0) ? 'Start price' : 'Current price'}
        </span>
        <span className={styles.amount}>
          {corePrice !== null && network ? toUnitFormatted(network, BigInt(corePrice)) : '—'}
        </span>
      </div>

      <div className={styles.multiCoreWrapper}>
        <div className={styles.multiCoreRow}>
          <div className={styles.coreModeToggle} onClick={() => setBuyMultiple((prev) => !prev)}>
            <div className={`${styles.coreModeSlider} ${buyMultiple ? styles.multiple : ''}`} />
            <div className={`${styles.coreModeOption} ${!buyMultiple ? styles.active : ''}`}>
              Single
            </div>
            <div className={`${styles.coreModeOption} ${buyMultiple ? styles.active : ''}`}>
              Multiple
            </div>
          </div>

          {buyMultiple && (
            <input
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              className={styles.coreInput}
              value={numCores === null ? '' : String(numCores)}
              onChange={(e) => {
                const raw = e.target.value;
                if (/^\d*$/.test(raw)) {
                  setNumCores(raw === '' ? null : parseInt(raw, 10));
                }
              }}
              onKeyDown={(e) => {
                if (['e', 'E', '.', ',', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder='Amount'
            />
          )}
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

      <button onClick={openModal} className={styles.buyButton}>
        Purchase New Core
        {buyMultiple && numCores !== null && numCores > 1 ? `s (${numCores})` : ''}
      </button>

      <Toaster />
    </div>
  );
}
