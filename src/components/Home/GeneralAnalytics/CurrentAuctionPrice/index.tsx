import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './CurrentAuctionPrice.module.scss';

import { $network, $connections } from '@/api/connection';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import { getCorePriceAt, toUnitFormatted, timesliceToTimestamp } from '@/utils';
import { getNetworkMetadata, getNetworkChainIds } from '@/network';
import { getRelativeTime } from '@/utils/time';

const CurrentCorePrice: React.FC = () => {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const saleInfo = useUnit($latestSaleInfo);

  const [price, setPrice] = useState<string>('');
  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    const fetchPrice = async () => {
      if (!network || !connections || !saleInfo) return;

      const chainIds = getNetworkChainIds(network);
      const metadata = getNetworkMetadata(network);
      if (!chainIds || !metadata) return;

      const connection = connections[chainIds.relayChain];
      if (!connection || !connection.client || connection.status !== 'connected') return;

      try {
        const api = connection.client.getTypedApi(metadata.relayChain);
        const blockNumber: number = await api.query.System.Number.getValue();

        const rawPrice = getCorePriceAt(blockNumber, saleInfo, network);
        const formatted = toUnitFormatted(network, BigInt(rawPrice));
        setPrice(formatted);
      } catch (err) {
        console.error('Failed to fetch core price:', err);
        setPrice('Error');
      }
    };

    fetchPrice();
  }, [network, connections, saleInfo]);

  useEffect(() => {
    const fetchRelativeTime = async () => {
      if (!saleInfo || !network || !connections) return;
      const timestamp = await timesliceToTimestamp(saleInfo.regionBegin, network, connections);
      if (timestamp) {
        const relative = getRelativeTime(Number(timestamp.toString()));

        setRelativeTime(relative);
      }
    };

    fetchRelativeTime();
  }, [saleInfo, network, connections]);

  return (
    <div className={styles.container}>
      <span className={styles.label}>CURRENT AUCTION PRICE</span>

      <div className={styles.barWrapper}>
        <div className={styles.bar} />
        <div className={styles.plusButton}>+</div>
      </div>

      <div className={styles.price}>{price}</div>
      <div className={styles.unit}>/coretime</div>
      <div className={styles.timer}>Bulk sale ends {relativeTime}</div>
    </div>
  );
};

export default CurrentCorePrice;
