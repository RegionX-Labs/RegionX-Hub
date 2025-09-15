'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $latestSaleInfo, fetchSelloutPrice } from '@/coretime/saleInfo';
import { $network, $connections } from '@/api/connection';
import { purchaseHistoryRequested } from '@/coretime/purchaseHistory';
import { getCorePriceAt, toUnitFormatted } from '@/utils';
import styles from './CoreComparison.module.scss';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';

type Props = {
  view: string;
};

export default function CoreComparison({ view }: Props) {
  const [network, saleInfo, connections] = useUnit([$network, $latestSaleInfo, $connections]);

  const [renewalPrice, setRenewalPrice] = useState<number | null>(null);
  const [corePrice, setCorePrice] = useState<number | null>(null);

  useEffect(() => {
    if (network && saleInfo) {
      purchaseHistoryRequested({ network, saleCycle: saleInfo.saleCycle });

      (async () => {
        const networkChainIds = getNetworkChainIds(network);
        if (!networkChainIds) return null;
        const connection = connections[networkChainIds.relayChain];
        if (!connection || !connection.client || connection.status !== 'connected') return null;

        const client = connection.client;
        const metadata = getNetworkMetadata(network);
        if (!metadata) return null;

        const currentBlockNumber = await client
          .getTypedApi(metadata.relayChain)
          .query.System.Number.getValue();

        const currentPrice = getCorePriceAt(currentBlockNumber, { ...saleInfo }, network);

        setCorePrice(currentPrice);

        const sellout = await fetchSelloutPrice(network, connections);
        if (sellout !== null) {
          setRenewalPrice(Number(sellout));
        }
      })();
    }
  }, [network, saleInfo]);

  const isReady = renewalPrice !== null && corePrice !== null;
  const priceDiff = isReady ? corePrice! - renewalPrice! : null;
  const priceDiffFormatted = isReady ? toUnitFormatted(network, BigInt(Math.abs(priceDiff!))) : '';
  const diffPercent = isReady ? ((priceDiff! / corePrice!) * 100).toFixed(0) : null;

  return (
    <div
      className={`${styles.coreComparisonCard} ${
        view === 'Deploying a new project'
          ? styles.compact
          : view === 'Managing Existing Project'
            ? styles.extended
            : ''
      }`}
    >
      <p className={styles.title}>Renewal vs New Core price difference</p>
      <h2 className={`${styles.value} ${priceDiff! >= 0 ? styles.positive : styles.negative}`}>
        {priceDiff! >= 0 ? '+' : '−'}
        {priceDiffFormatted}
      </h2>
      <p className={styles.note}>
        Renewing during the interlude phase guarantees core procurement. Purchasing a core during the sale carries the risk that all cores will be sold out.
      </p>
      <div className={styles.bottomSection}>
        <p className={styles.subtext}>
          It is <span className={styles.priceDiff}>{Math.abs(Number(diffPercent))}%</span>{' '}
          {priceDiff! >= 0 ? 'cheaper' : 'more expensive'} to renew
        </p>
        <div className={styles.row}>
          <span className={styles.label}>Renewal cost</span>
          <span className={styles.amount}>
            {isReady ? toUnitFormatted(network, BigInt(renewalPrice!)) : ''}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Buy New</span>
          <span className={styles.amount}>
            {isReady ? toUnitFormatted(network, BigInt(corePrice!)) : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
