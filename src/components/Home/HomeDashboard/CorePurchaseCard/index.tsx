import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { $purchaseHistory, purchaseHistoryRequested } from '@/coretime/purchaseHistory';
import { $connections, $network } from '@/api/connection';
import { getCorePriceAt, toUnitFormatted } from '@/utils';
import styles from './CorePurchaseCard.module.scss';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';

export default function CorePurchaseCard() {
  const [connections, network, saleInfo, purchaseHistory] = useUnit([
    $connections,
    $network,
    $latestSaleInfo,
    $purchaseHistory,
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

  const buyCore = () => {
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

    (client.getTypedApi(metadata.coretimeChain).tx as any).Broker.purchase({price_limit: corePrice});

    toast.success('Transaction confirmed!');
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
