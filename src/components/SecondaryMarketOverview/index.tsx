import React, { useEffect, useState } from 'react';
import styles from './SecondaryMarketOverview.module.scss';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { $accountData } from '@/account';
import { toUnitFormatted } from '@/utils';
import { $listedRegions, RegionListing } from '@/marketplace';
import { Toaster } from 'react-hot-toast';

export default function SecondaryMarketOverview() {
  const [network, selectedAccount, accountDataMap, listedRegions] = useUnit([
    $network,
    $selectedAccount,
    $accountData,
    $listedRegions,
  ]);

  const [averageBlockPrice, setAverageBlockPrice] = useState(BigInt(0));
  const [lowestBlockPrice, setLowestBlockPrice] = useState(BigInt(0));

  // Based on price per timeslice.
  const [bestListing, setBestListing] = useState<RegionListing | null>(null);

  useEffect(() => {
    if (listedRegions.length < 1) return;

    const averageTimeslicePrice = listedRegions.length
      ? listedRegions.reduce((sum, r) => sum + r.timeslice_price, BigInt(0)) /
        BigInt(listedRegions.length)
      : BigInt(0);

    setAverageBlockPrice(averageTimeslicePrice / BigInt(80));
    const lowestPricePerTimeslice = listedRegions.reduce(
      (min, r) => (r.timeslice_price < min ? r.timeslice_price : min),
      listedRegions[0].timeslice_price
    );
    setLowestBlockPrice(lowestPricePerTimeslice / BigInt(80));

    const _bestListing = listedRegions.find((l) => l.timeslice_price === lowestPricePerTimeslice);
    setBestListing(_bestListing ?? null);
  }, [listedRegions]);

  const accountData = selectedAccount?.address ? accountDataMap[selectedAccount.address] : null;

  const formattedRelay =
    accountData?.relayChainData?.free != null
      ? toUnitFormatted(network, accountData.relayChainData.free)
      : '--';

  const formattedCoretime =
    accountData?.coretimeChainData?.free != null
      ? toUnitFormatted(network, accountData.coretimeChainData.free)
      : '--';

  const calculatePrice = (listing: RegionListing): bigint => {
    return listing.timeslice_price * BigInt(listing.region.end - listing.region.begin);
  };

  return (
    <div className={styles.card}>
      <div className={styles.title}>Average Price Per Block</div>
      <div className={styles.averagePrice}>{toUnitFormatted(network, averageBlockPrice)}</div>

      <div className={styles.volumeLabel}>Cheapest Price Per Block</div>
      <div className={styles.volumeValue}>{toUnitFormatted(network, lowestBlockPrice)}</div>

      {selectedAccount && accountData && (
        <div className={styles.balanceBox}>
          <div className={styles.balanceItem}>
            <span className={styles.label}>Relay Chain Balance</span>
            <span className={styles.value}>{formattedRelay}</span>
          </div>
          <div className={`${styles.balanceItem} ${styles.alignRight}`}>
            <span className={styles.label}>Coretime Chain Balance</span>
            <span className={styles.value}>{formattedCoretime}</span>
          </div>
        </div>
      )}

      <div className={styles.listingLabel}>Best Current Listing (based on block price)</div>
      <div className={styles.listingBox}>
        <div className={styles.listingId}>Core ID {bestListing?.region.core}</div>
        <div className={styles.listingPrice}>
          {bestListing ? toUnitFormatted(network, calculatePrice(bestListing)) : '-'}
        </div>
        <button className={styles.buyButton}>Buy Now</button>
      </div>
      <Toaster />
    </div>
  );
}
