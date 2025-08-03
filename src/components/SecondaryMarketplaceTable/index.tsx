import React, { useState, useEffect, useRef } from 'react';
import styles from './SecondaryMarketplaceTable.module.scss';
import { TableComponent } from '@/components/elements/TableComponent';
import { Filter } from 'lucide-react';
import { useUnit } from 'effector-react';
import { TableData } from '@/types/type';
import { $connections, $network } from '@/api/connection';
import { $listedRegions, listedRegionsRequested, RegionListing } from '@/marketplace';
import {
  bitStringToUint8Array,
  countBits,
  maskToBin,
  timesliceToTimestamp,
  toUnitFormatted,
} from '@/utils';
import { $selectedAccount } from '@/wallet';
import toast, { Toaster } from 'react-hot-toast';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { FixedSizeBinary } from 'polkadot-api';
import { $accountData, getAccountData, MultiChainAccountData } from '@/account';
import TransactionModal from '../TransactionModal';

export default function SecondaryMarketplaceTable() {
  const [network, connections, selectedAccount, accountData, listedRegions] = useUnit([
    $network,
    $connections,
    $selectedAccount,
    $accountData,
    $listedRegions,
  ]);

  const [tableData, setTableData] = useState<Record<string, TableData>[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minPercentage, setMinPercentage] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listedRegionsRequested({ network, connections });
  }, [network, connections]);

  const getDateFromTimeslice = async (timeslice: number): Promise<string> => {
    const timestamp = await timesliceToTimestamp(timeslice, network, connections);
    if (!timestamp) return '-';

    return formatDate(timestamp);
  };

  const formatDate = (timestamp: Date | bigint | null): string => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp));
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculatePrice = (listing: RegionListing): bigint => {
    return listing.timeslice_price * BigInt(listing.region.end - listing.region.begin);
  };

  const parseNumber = (value: string) => parseFloat(value.replace(/[^\d.]/g, ''));

  const filteredData = tableData.filter((row: any) => {
    const price = parseNumber(row.Price.data);
    const percentage = parseNumber(row.CorePercentage.data);
    return (
      (maxPrice === null || price <= maxPrice) &&
      (minPercentage === null || percentage >= minPercentage)
    );
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    setIsModalOpen(true);
  };

  const onModalConfirm = async (listing: RegionListing) => {
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
      max_price: calculatePrice(listing),
      region_id: {
        begin: listing.region.begin,
        core: listing.region.core,
        mask: new FixedSizeBinary(bitStringToUint8Array(maskToBin(listing.region.mask))),
      },
    });
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed');
            console.log(err);
          } else {
            toast.success('Transaction succeded!');
            getAccountData({ account: selectedAccount.address, connections, network });
          }
        }
      },
      (e) => {
        toast.error('Transaction cancelled');
        console.log(e);
      }
    );
  };

  useEffect(() => {
    (async () => {
      const data = [];
      for (const listing of listedRegions) {
        const beginDate = await getDateFromTimeslice(listing.region.begin);
        const endDate = await getDateFromTimeslice(listing.region.end);

        data.push({
          CoreId: { cellType: 'text' as const, data: listing.region.core.toString() },
          Timeline: { cellType: 'text' as const, data: `${beginDate} → ${endDate}` },
          Price: {
            cellType: 'text' as const,
            data: toUnitFormatted(network, calculatePrice(listing)),
          }, // TODO: need region end for this.
          Deployment: { cellType: 'text' as const, data: `Usable from ${beginDate}` },
          CorePercentage: {
            cellType: 'text' as const,
            data: `${((countBits(listing.region.mask) * 720) / 57600) * 100}%`,
          },
          Action: {
            cellType: 'jsx' as const,
            data: (
              <div className={styles.actionCell}>
                <button onClick={openModal} className={styles.buyButton}>
                  Buy Now
                </button>
                {selectedAccount && accountData[selectedAccount.address] !== null && (
                  <TransactionModal
                    isOpen={isModalOpen}
                    accountData={accountData[selectedAccount.address] as MultiChainAccountData}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => onModalConfirm(listing)}
                  />
                )}
              </div>
            ),
          },
        });
      }

      return data;
    })().then((_data) => setTableData(_data));
  }, [listedRegions, isModalOpen, selectedAccount, accountData]);

  return (
    <div className={styles.secondaryMarketTableContainer}>
      <div className={styles.secondaryMarketTableInner}>
        <div className={styles.tableWrapper}>
          <div className={styles.headerRow}>
            <h2 className={styles.marketHeading}>Secondary Marketplace Snapshot</h2>
            <div className={styles.filterWrapper} ref={panelRef}>
              <button className={styles.filterButton} onClick={() => setOpen((prev) => !prev)}>
                <Filter size={16} />
                <span>Filters</span>
              </button>

              {open && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterInputGroup}>
                    <label>Max Price (DOT)</label>
                    <input
                      type='number'
                      min='0'
                      value={maxPrice ?? ''}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? Math.max(0, parseFloat(e.target.value)) : null)
                      }
                      placeholder='Maximum price in DOT'
                    />
                  </div>
                  <div className={styles.filterInputGroup}>
                    <label>Min %</label>
                    <input
                      type='number'
                      min='0'
                      value={minPercentage ?? ''}
                      onChange={(e) =>
                        setMinPercentage(
                          e.target.value ? Math.max(0, parseFloat(e.target.value)) : null
                        )
                      }
                      placeholder='Minimum core %'
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <TableComponent data={filteredData} pageSize={6} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
