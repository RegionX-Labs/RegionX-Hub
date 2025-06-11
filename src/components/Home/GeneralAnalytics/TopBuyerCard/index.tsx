import styles from './TopBuyerCard.module.scss';
import { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { $purchaseHistory } from '@/coretime/purchaseHistory';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import Identicon from '@polkadot/react-identicon';

export default function TopBuyerCard() {
  const [purchaseHistory, saleInfo] = useUnit([$purchaseHistory, $latestSaleInfo]);

  const { topBuyer, totalBought } = useMemo(() => {
    const grouped: Record<string, number> = {};

    for (const item of purchaseHistory) {
      grouped[item.address] = (grouped[item.address] || 0) + item.core;
    }

    let topBuyer: string | null = null;
    let maxCores = 0;

    for (const [address, cores] of Object.entries(grouped)) {
      if (cores > maxCores) {
        topBuyer = address;
        maxCores = cores;
      }
    }

    return { topBuyer, totalBought: maxCores };
  }, [purchaseHistory]);

  if (!topBuyer || !saleInfo?.coresOffered) return null;

  const percentage = ((totalBought / saleInfo.coresOffered) * 100).toFixed(1);

  return (
    <div className={styles.topBuyerCard}>
      <p className={styles.label}>Top Buyer</p>
      <div className={styles.row}>
        <Identicon value={topBuyer} size={32} theme='polkadot' />
        <span className={styles.address}>{topBuyer.slice(0, 10)}…</span>
      </div>
      <p className={styles.cores}>
        {totalBought} cores ({percentage}%)
      </p>
    </div>
  );
}
