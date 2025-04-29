import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { $network } from '@/api/connection';
import { getCorePriceAt, toUnitFormatted } from '@/utils';
import styles from './CoreRemaining.module.scss'; // using same styles

export default function CoreRemaining() {
  const [network, saleInfo] = useUnit([$network, $latestSaleInfo]);
  const [corePrice, setCorePrice] = useState<number | null>(null);

  useEffect(() => {
    if (network) latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    if (network && saleInfo) {
      const now = saleInfo.saleStart + saleInfo.leadinLength;
      const price = getCorePriceAt(now, saleInfo);
      setCorePrice(price);
    }
    console.log('coresOffered:', saleInfo?.coresOffered);
    console.log('coresSold:', saleInfo?.coresSold);
  }, [network, saleInfo]);

  return (
    <div className={styles.coreRemainingCard}>
      <p className={styles.title}>Core Remaining</p>
      <h2 className={styles.value}>
        {saleInfo ? Number(saleInfo.coresOffered ?? 0) - Number(saleInfo.coresSold ?? 0) : '—'}
      </h2>

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
