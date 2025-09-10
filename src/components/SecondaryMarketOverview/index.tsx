import React, { useEffect, useState } from 'react';
import styles from './SecondaryMarketOverview.module.scss';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { $accountData } from '@/account';
import { TIMESLICE_PERIOD, toUnitFormatted } from '@/utils';
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
      ? listedRegions.reduce((sum, r) => sum + r.price_data, BigInt(0)) /
        BigInt(listedRegions.length)
      : BigInt(0);

    setAverageBlockPrice(averageTimeslicePrice / BigInt(80));

    const lowestPricePerTimeslice = listedRegions.reduce(
      (min, r) => (r.price_data < min ? r.price_data : min),
      listedRegions[0].price_data
    );
    setLowestBlockPrice(lowestPricePerTimeslice / BigInt(80));

    const _bestListing = listedRegions.find((l) => l.price_data === lowestPricePerTimeslice);
    setBestListing(_bestListing ?? null);
  }, [listedRegions]);

  const getPricePerBlock = (listing: RegionListing): bigint => {
    const timesliceDuration = listing.region.end - listing.region.begin;
    const blockDuration = timesliceDuration * TIMESLICE_PERIOD;

    return listing.price_data / BigInt(blockDuration);
  };

  const accountData = selectedAccount?.address ? accountDataMap[selectedAccount.address] : null;

  const formattedRegionX =
    accountData?.regionxChainData?.free != null
      ? toUnitFormatted(network, accountData.regionxChainData.free)
      : '-';

  const formattedCoretime =
    accountData?.coretimeChainData?.free != null
      ? toUnitFormatted(network, accountData.coretimeChainData.free)
      : '-';

  return (
    <div className={styles.card}>
      <div className={styles.title}>Average Price Per Block</div>
      <div className={styles.averagePrice}>{toUnitFormatted(network, averageBlockPrice)}</div>

      <div className={styles.volumeLabel}>Cheapest Price Per Block</div>
      <div className={styles.volumeValue}>{toUnitFormatted(network, lowestBlockPrice)}</div>

      <div className={styles.balanceBox}>
        <div className={`${styles.balanceItem} ${styles.alignRight}`}>
          <span className={styles.label}>Coretime Chain Balance</span>
          <span className={styles.value}>{formattedCoretime}</span>
        </div>
        <div className={styles.balanceItem}>
          <span className={styles.label}>RegionX Chain Balance</span>
          <span className={styles.value}>{formattedRegionX}</span>
        </div>
      </div>

      <div className={styles.listingLabel}>Best Current Listing (based on block price)</div>
      <div className={styles.listingBox}>
        <div className={styles.listingId}>
          {bestListing ? `Core ID ${bestListing.region.core}` : '-'}
        </div>
        <div className={styles.listingPrice}>
          {bestListing ? toUnitFormatted(network, getPricePerBlock(bestListing)) : '-'}
        </div>
        <button className={styles.buyButton}>Buy Now</button>
      </div>

      <Toaster />
    </div>
  );
}
