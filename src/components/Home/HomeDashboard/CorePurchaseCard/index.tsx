import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { $purchaseHistory, purchaseHistoryRequested } from '@/coretime/purchaseHistory';
import { $connections, $network } from '@/api/connection';
import { getCorePriceAt, toUnitFormatted } from '@/utils';
import styles from './CorePurchaseCard.module.scss';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';
import { $selectedAccount } from '@/wallet';

export default function CorePurchaseCard() {
  const [connections, network, saleInfo, purchaseHistory, selectedAccount] = useUnit([
    $connections,
    $network,
    $latestSaleInfo,
    $purchaseHistory,
    $selectedAccount
  ]);

  const [corePrice, setCorePrice] = useState<number | null>(null);
  const [currentHeight, setCurrentHeight] = useState<number>(0);

  useEffect(() => {
    if (network) latestSaleRequested(network);
  }, [network]);

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

        const currentBlockNumber = await (
          client.getTypedApi(metadata.coretimeChain) as any
        ).query.System.Number.getValue();
        setCurrentHeight(currentHeight);
        const price = getCorePriceAt(currentBlockNumber, saleInfo);
        setCorePrice(price);
      })();
    }
  }, [saleInfo?.network, connections]);

  const coresSold = purchaseHistory.length;
  const coresOffered = saleInfo?.coresOffered ?? 0;
  const coresRemaining = coresOffered - coresSold;

  const buyCore = async () => {
    if(!selectedAccount) { 
      toast.error('Account not selected');
      return;
    }
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    };
    const connection = connections[networkChainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    };

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    };

    if(!corePrice) {
      toast.error('Failed to fetch the price of a core');
      return;
    }

    const tx = (client.getTypedApi(metadata.coretimeChain).tx as any).Broker.purchase({price_limit: BigInt(corePrice)});
    const res = await tx.signAndSubmit(selectedAccount.polkadotSigner);
     if(res.ok) {
      toast.success('Transaction succeded!');
    }else {
      // TODO: provide more detailed error
      toast.error('Transaction failed');
    }
  }

  return (
    <div className={styles.coreRemainingCard}>
      <p className={styles.title}>Core Offered</p>
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

      <button onClick={buyCore} className={styles.buyButton}>Buy Core</button>
      <Toaster />
    </div>
  );
}
