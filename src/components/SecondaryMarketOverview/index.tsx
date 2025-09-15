import React, { useEffect, useState } from 'react';
import styles from './SecondaryMarketOverview.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { $accountData, MultiChainAccountData } from '@/account';
import { TIMESLICE_PERIOD, bitStringToUint8Array, maskToBin, toUnitFormatted } from '@/utils';
import { $listedRegions, RegionListing } from '@/marketplace';
import toast, { Toaster } from 'react-hot-toast';
import TransactionModal from '../TransactionModal';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { FixedSizeBinary } from 'polkadot-api';

export default function SecondaryMarketOverview() {
  const [network, selectedAccount, accountData, listedRegions, connections] = useUnit([
    $network,
    $selectedAccount,
    $accountData,
    $listedRegions,
    $connections
  ]);

  const [averageBlockPrice, setAverageBlockPrice] = useState(BigInt(0));
  const [lowestBlockPrice, setLowestBlockPrice] = useState(BigInt(0));
  // Based on price per timeslice.
  const [bestListing, setBestListing] = useState<RegionListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const _accountData = selectedAccount?.address ? accountData[selectedAccount.address] : null;

  const formattedRegionX =
  _accountData?.regionxChainData?.free != null
      ? toUnitFormatted(network, _accountData.regionxChainData.free)
      : '-';

  const formattedCoretime =
  _accountData?.coretimeChainData?.free != null
      ? toUnitFormatted(network, _accountData.coretimeChainData.free)
      : '-';
    
  const openBuyModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    setIsModalOpen(true);
  }

  const onBuyModalConfirm = async (listing: RegionListing) => {
    await buyRegion(listing);
    setIsModalOpen(false);
  };

  const buyRegion = async (listing: RegionListing) => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }

    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    if (!networkChainIds.regionxChain || !metadata.regionxChain) {
      toast.error(`RegionX doesn't support this network yet`);
      return;
    }

    const connection = connections[networkChainIds.regionxChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;

    const tx = client.getTypedApi(metadata.regionxChain).tx.Market.purchase_region({
      max_price: listing.price_data,
      region_id: {
        begin: listing.region.begin,
        core: listing.region.core,
        mask: new FixedSizeBinary(bitStringToUint8Array(maskToBin(listing.region.mask))),
      },
    });
    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(<span>Transaction submitted.</span>, { id: toastId });
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else toast.success('Transaction succeeded!', { id: toastId });
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
  };

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
        <button onClick={openBuyModal} className={styles.buyButton}>Buy Now</button>
        {selectedAccount && bestListing && accountData[selectedAccount.address] !== null && (
          <TransactionModal
            isOpen={isModalOpen}
            accountData={accountData[selectedAccount.address] as MultiChainAccountData}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => onBuyModalConfirm(bestListing)}
          />
        )}
      </div>

      <Toaster />
    </div>
  );
}
