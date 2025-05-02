import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { $purchaseHistory, purchaseHistoryRequested } from '@/coretime/purchaseHistory';
import { $network } from '@/api/connection';
import { getCorePriceAt, toUnitFormatted } from '@/utils';
import styles from './CorePurchaseCard.module.scss';

export default function CorePurchaseCard() {
  const [network, saleInfo, purchaseHistory] = useUnit([
    $network,
    $latestSaleInfo,
    $purchaseHistory,
  ]);

  const [corePrice, setCorePrice] = useState<number | null>(null);

  useEffect(() => {
    if (network) latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    if (network && saleInfo) {
      purchaseHistoryRequested({
        network,
        saleCycle: saleInfo.saleCycle,
      });
      latestSaleRequested(network);

      const now = saleInfo.saleStart + saleInfo.leadinLength;
      const price = getCorePriceAt(now, saleInfo);
      setCorePrice(price);
    }
  }, [network, saleInfo]);

  const coresSold = purchaseHistory.length;
  const coresOffered = saleInfo?.coresOffered ?? 0;
  const coresRemaining = coresOffered - coresSold;

  return (
    <div className={styles.coreRemainingCard}>
      <p className={styles.title}>Core Offered</p>
      <h2 className={styles.value}>{saleInfo ? coresOffered : '—'}</h2>
      <p className={styles.title}>Cores Remaining</p>
      <h2 className={styles.value}>{saleInfo ? coresRemaining : '—'}</h2>

      <div className={styles.row}>
        <span className={styles.label}>Current price</span>
        <span className={styles.amount}>
          {corePrice !== null && network ? toUnitFormatted(network, BigInt(corePrice)) : '—'}
        </span>
      </div>

      <button className={styles.buyButton}>Buy Core</button>
    </div>
  );
}

