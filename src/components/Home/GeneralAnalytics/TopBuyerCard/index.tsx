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
      grouped[item.address] = (grouped[item.address] || 0) + 1;
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

      <div className={styles.buyerRow}>
        <Identicon value={topBuyer} size={36} theme='polkadot' />
        <div className={styles.addressGroup}>
          <span className={styles.address}>
            {topBuyer.slice(0, 6)}...{topBuyer.slice(-6)}
          </span>
          <span className={styles.subtext}>Most cores purchased this cycle</span>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.value}>{totalBought}</span>
          <span className={styles.metricLabel}>Cores purchased</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.value}>{percentage}%</span>
          <span className={styles.metricLabel}>of total offered</span>
        </div>
      </div>
    </div>
  );
}
