import { useUnit } from 'effector-react';
import styles from './BulkSaleSummary.module.scss';

import { $network } from '@/api/connection';
import { $purchaseHistory, PurchaseType } from '@/coretime/purchaseHistory';
import RevenueBox from '../RevenueBox/index';
import CurrentAuctionPrice from '../CurrentAuctionPrice';
import UserBalance from '../UserBalance';
import AuctionPriceOverview from '../AuctionPriceOverview';
import TopBuyerCard from '../TopBuyerCard';

export default function BulkSaleSummary() {
  const [network, purchaseHistory] = useUnit([$network, $purchaseHistory]);

  // purchaseHistory is fetched globally in _app.tsx.

  const bulkRevenue = purchaseHistory
    .filter((item) => item.type === PurchaseType.BULK)
    .reduce((sum, item) => sum + item.price, 0);

  const renewals = purchaseHistory
    .filter((item) => item.type === PurchaseType.RENEWAL)
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={styles.analyticsCard}>
      <UserBalance />
      <AuctionPriceOverview />
      <TopBuyerCard />

      <RevenueBox
        network={network}
        purchaseHistory={purchaseHistory}
        previousBulkRevenue={null}
        bulkRevenue={bulkRevenue}
        renewals={renewals}
        bulkChangePercent={0}
        renewalChangePercent={0}
      />

      <CurrentAuctionPrice />
    </div>
  );
}
