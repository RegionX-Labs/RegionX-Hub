'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, fetchCoresSold, getCurrentPhase, SalePhase } from '@/coretime/saleInfo';
import { purchaseHistoryRequested } from '@/coretime/purchaseHistory';
import { $connections, $network } from '@/api/connection';
import { getCorePriceAt, SOLD_OUT_MESSAGE, toUnitFormatted } from '@/utils';
import styles from './CorePurchaseCard.module.scss';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';
import { $selectedAccount } from '@/wallet';
import TransactionModal from '@/components/TransactionModal';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';

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

  const isCompact = view === 'Deploying a new project';
  const isExtended = view === 'Managing Existing Project';

  const [corePrice, setCorePrice] = useState<number | null>(null);
  const [coresSold, setCoresSold] = useState<number | null>(null);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SalePhase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [buyMultiple, setBuyMultiple] = useState(false);
  const [numCores, setNumCores] = useState<number | null>(null);

  useEffect(() => {
    const networkChainIds = network ? getNetworkChainIds(network) : null;
    const metadata = network ? getNetworkMetadata(network) : null;
    const relayConnection = networkChainIds ? connections[networkChainIds.relayChain] : null;
    const relayClient = relayConnection?.client;
    const isRelayConnected = Boolean(relayClient && relayConnection.status === 'connected');

    if (!saleInfo || !network || !networkChainIds || !metadata || !isRelayConnected || !relayClient)
      return;

    let isMounted = true;

    (async () => {
      purchaseHistoryRequested({ network, saleCycle: saleInfo.saleCycle });

      const currentBlockNumber = await relayClient
        .getTypedApi(metadata.relayChain)
        .query.System.Number.getValue();

      if (!isMounted) return;

      setCurrentHeight(currentBlockNumber);
      setCorePrice(getCorePriceAt(currentBlockNumber, saleInfo, network));
      setCurrentPhase(getCurrentPhase(saleInfo, currentBlockNumber));

      const sold = await fetchCoresSold(network, connections);
      if (isMounted) setCoresSold(sold ?? 0);
    })();

    return () => {
      isMounted = false;
    };
  }, [connections, network, saleInfo]);

  const ensureCanPurchase = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return false;
    }
    if (currentPhase === SalePhase.Interlude) {
      toast.error('Cannot purchase during interlude phase');
      return false;
    }
    if (coresRemaining === undefined) {
      toast.error('Failed to fetch availability of cores');
      return false;
    }
    if (coresRemaining === 0) {
      toast.error(SOLD_OUT_MESSAGE);
      return false;
    }

    return true;
  };

  const coresOffered = saleInfo?.coresOffered ?? 0;

  const coresRemaining =
    saleInfo && coresSold !== null ? Math.max(coresOffered - coresSold, 0) : undefined;
  const saleHasStarted = Boolean(
    saleInfo && currentHeight !== null && currentHeight >= saleInfo.saleStart
  );
  const priceLabel = saleHasStarted ? 'Current price' : 'Start price';

  const openModal = () => {
    if (!ensureCanPurchase()) return;

    if (corePrice === null) return toast.error('Failed to fetch the price of a core');

    if (buyMultiple) {
      if (numCores === null || numCores <= 0) {
        return toast.error('Enter a valid number of cores');
      }
      if (coresRemaining === undefined || numCores > coresRemaining) {
        return toast.error(
          coresRemaining === undefined
            ? 'Unable to verify available cores'
            : `Enter a valid number of cores (1–${coresRemaining})`
        );
      }
    }

    const selectedAccountData = selectedAccount ? accountData[selectedAccount.address] : null;
    if (!selectedAccountData?.coretimeChainData) {
      return toast.error('Account data unavailable');
    }
    const times = buyMultiple ? Math.min(numCores ?? 0, coresRemaining ?? 0) : 1;
    const required = BigInt(corePrice) * BigInt(times || 1);
    if (selectedAccountData.coretimeChainData.free < required) {
      return toast.error('Insufficient coretime balance for purchase');
    }

    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    await buyCore();
    setIsModalOpen(false);
  };

  const buyCore = async () => {
    if (!ensureCanPurchase()) return;
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

    const times = buyMultiple ? Math.min(numCores ?? 0, coresRemaining ?? 1) : 1;

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
      className={`${styles.coreRemainingCard} ${isCompact ? styles.compact : ''} ${
        isExtended ? styles.extended : ''
      }`}
    >
      <p className={styles.title}>Cores Offered</p>
      <h2 className={styles.value}>{saleInfo ? coresOffered : '—'}</h2>
      <p className={styles.title}>Cores Remaining</p>
      <h2 className={styles.value}>{saleInfo ? coresRemaining : '—'}</h2>

      <div className={styles.row}>
        <span className={styles.label}>{priceLabel}</span>
        <span className={styles.amount}>
          {corePrice !== null && network ? toUnitFormatted(network, BigInt(corePrice)) : '—'}
        </span>
      </div>

      <div className={styles.multiCoreWrapper}>
        <div className={styles.multiCoreRow}>
          <div className={styles.coreModeToggle} onClick={() => setBuyMultiple((p) => !p)}>
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
                if (/^\d*$/.test(raw)) setNumCores(raw === '' ? null : parseInt(raw, 10));
              }}
              onKeyDown={(e) => {
                if (['e', 'E', '.', ',', '+', '-'].includes(e.key)) e.preventDefault();
              }}
              placeholder='Amount'
            />
          )}
        </div>

        <button onClick={openModal} className={styles.buyButton}>
          Purchase New Core
          {buyMultiple && numCores !== null && numCores > 1 ? `s (${numCores})` : ''}
        </button>
      </div>

      {selectedAccount && accountData[selectedAccount.address] !== null && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onModalConfirm}
        />
      )}

      <Toaster />
    </div>
  );
}
