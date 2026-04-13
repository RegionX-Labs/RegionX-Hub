import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import styles from './BulkSaleSummary.module.scss';

import { $network } from '@/api/connection';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import {
  $purchaseHistory,
  purchaseHistoryRequested,
  PurchaseType,
} from '@/coretime/purchaseHistory';
import { toUnitFormatted } from '@/utils';
import RevenueBox from '../RevenueBox/index';
import CurrentAuctionPrice from '../CurrentAuctionPrice';
import UserBalance from '../UserBalance';
import AuctionPriceOverview from '../AuctionPriceOverview';
import TopBuyerCard from '../TopBuyerCard';

export default function BulkSaleSummary() {
  const [network, saleInfo, purchaseHistory] = useUnit([
    $network,
    $latestSaleInfo,
    $purchaseHistory,
  ]);

  useEffect(() => {
    if (network && saleInfo) {
      purchaseHistoryRequested({ network, saleCycle: saleInfo.saleCycle });
    }
  }, [network, saleInfo]);

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
