import React from 'react';
import styles from './SecondaryMarketOverview.module.scss';
import { useUnit } from 'effector-react';
import { $network, $connections } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { $accountData } from '@/account';
import { toUnitFormatted } from '@/utils';

export default function SecondaryMarketOverview() {
  const [network, selectedAccount, accountDataMap] = useUnit([
    $network,
    $selectedAccount,
    $accountData,
  ]);

  const accountData = selectedAccount?.address ? accountDataMap[selectedAccount.address] : null;

  const formattedRelay =
    accountData?.relayChainData?.free != null
      ? toUnitFormatted(network, accountData.relayChainData.free)
      : '--';

  const formattedCoretime =
    accountData?.coretimeChainData?.free != null
      ? toUnitFormatted(network, accountData.coretimeChainData.free)
      : '--';

  return (
    <div className={styles.card}>
      <div className={styles.title}>Average Price</div>
      <div className={styles.averagePrice}>SOL 65.740</div>

      <div className={styles.volumeLabel}>Volume of recent sales</div>
      <div className={styles.volumeValue}>DOT 43</div>

      {selectedAccount && accountData && (
        <div className={styles.balanceBox}>
          <div className={styles.balanceItem}>
            <span className={styles.label}>Relay Chain Balance</span>
            <span className={styles.value}>{formattedRelay} DOT</span>
          </div>
          <div className={`${styles.balanceItem} ${styles.alignRight}`}>
            <span className={styles.label}>Coretime Chain Balance</span>
            <span className={styles.value}>{formattedCoretime} DOT</span>
          </div>
        </div>
      )}

      <div className={styles.listingLabel}>Best Current Listing</div>
      <div className={styles.listingBox}>
        <div className={styles.listingId}>ID 234.1245</div>
        <div className={styles.listingPrice}>$29,340.20</div>
        <button className={styles.buyButton}>Buy Now</button>
      </div>
    </div>
  );
}
