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

export default function CorePurchaseCard() {
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

  useEffect(() => {
    if (network && saleInfo) {
      (async () => {
        const networkChainIds = getNetworkChainIds(network);
        if (!networkChainIds) return null;
        const connection = connections[networkChainIds.coretimeChain];
        if (!connection || !connection.client || connection.status !== 'connected') return null;

        const client = connection.client;
        const metadata = getNetworkMetadata(network);
        if (!metadata) return null;

        purchaseHistoryRequested({
          network,
          saleCycle: saleInfo.saleCycle,
        });

        const currentBlockNumber = await client
          .getTypedApi(metadata.coretimeChain)
          .query.System.Number.getValue();
        setCurrentHeight(currentBlockNumber);
        const price = getCorePriceAt(currentBlockNumber, saleInfo);
        setCorePrice(price);
        const coresSold = await fetchCoresSold(network, connections);
        setCoresSold(coresSold || 0);
      })();
    }
  }, [saleInfo?.network, connections]);

  useEffect(() => {
    (async () => {
      if (!saleInfo) return;
      const networkChainIds = getNetworkChainIds(network);
      if (!networkChainIds) return;
      const connection = connections[networkChainIds.coretimeChain];
      if (!connection || !connection.client || connection.status !== 'connected') return;

      const client = connection.client;
      const metadata = getNetworkMetadata(network);
      if (!metadata) return;

      const currentBlockNumber = await client
        .getTypedApi(metadata.coretimeChain)
        .query.System.Number.getValue();
      const phase = getCurrentPhase(saleInfo, currentBlockNumber);
      setCurrentPhase(phase);
    })();
  }, [network, saleInfo]);

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    if (currentPhase === SalePhase.Interlude) {
      toast.error('Cannot purchase a core during interlude phase');
      return;
    }
    if (coresSold == saleInfo?.coresOffered) {
      toast.error('No more cores remaining');
      return;
    }
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    await buyCore();
    setIsModalOpen(false);
  };

  const coresOffered = saleInfo?.coresOffered ?? 0;
  const coresRemaining = coresOffered - coresSold;

  const buyCore = async () => {
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

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    if (!corePrice) {
      toast.error('Failed to fetch the price of a core');
      return;
    }

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.purchase({
      price_limit: BigInt(corePrice),
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
    <div className={styles.coreRemainingCard}>
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
      </button>
      <Toaster />
    </div>
  );
}
