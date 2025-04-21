import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './CurrentAuctionPrice.module.scss';

import { $network } from '@/api/connection';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { getCorePriceAt, toUnitFormatted } from '@/utils';

export default function CurrentAuctionPrice() {
  const [network, saleInfo] = useUnit([$network, $latestSaleInfo]);
  const [price, setPrice] = useState<string>('...');

  useEffect(() => {
    if (network) latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    if (network && saleInfo) {
      const now = Math.floor(Date.now() / 1000);
      const rawPrice = getCorePriceAt(now, saleInfo);
      const priceBigInt = BigInt(Math.round(rawPrice));
      const formatted = toUnitFormatted(network, priceBigInt);
      console.log('Coretime Price:', formatted);
      setPrice(formatted);
    }
  }, [network, saleInfo]);

  return (
    <div className={styles.container}>
      <span className={styles.label}>CURRENT AUCTION PRICE</span>

      <div className={styles.barWrapper}>
        <div className={styles.bar} />
        <div className={styles.plusButton}>+</div>
      </div>

      <div className={styles.price}>{price}</div>
      <div className={styles.unit}>/coretime</div>
      <div className={styles.timer}>2 HOURS : 14 MINUTES</div>
    </div>
  );
}
