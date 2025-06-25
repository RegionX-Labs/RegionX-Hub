import React, { useEffect, useState } from 'react';
import styles from './secondary-market.module.scss';
import { TableComponent } from '../../components/elements/TableComponent';
import { $listedRegions, listedRegionsRequested, RegionListing } from '@/marketplace';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { countBits, timesliceToTimestamp, toUnitFormatted } from '@/utils';
import { TableData } from '@/types/type';

export default function SecondaryMarket() {
  const [network, connections, listedRegions] = useUnit([$network, $connections, $listedRegions]);
  const [tableData, setTableData] = useState<Record<string, TableData>[]>([]);

  useEffect(() => {
    listedRegionsRequested({network, connections});
  }, [network, connections]);

  useEffect(() => {
    (async() => {
      const data = [];
      for(const listing of listedRegions) {
        const beginDate = await getDateFromTimeslice(listing.region.begin);
        const endDate = await getDateFromTimeslice(listing.region.end);

        data.push({
          CoreId: { cellType: 'text' as const, data: listing.region.core.toString() },
          Timeline: { cellType: 'text' as const, data: `${beginDate} → ${endDate}` },
          Price: { cellType: 'text' as const, data: toUnitFormatted(network, calculatePrice(listing)) }, // TODO: need region end for this.
          Deployment: { cellType: 'text' as const, data: `Usable from ${beginDate}` },
          CorePercentage: { cellType: 'text' as const, data: `${((countBits(listing.region.mask) * 720) / 57600) * 100}%` },
          Action: {
            cellType: 'jsx' as const,
            data: (
              <div className={styles.actionCell}>
                <button className={styles.buyButton}>Buy Now</button>
              </div>
            ),
          },
        });
      }

      return data;
    })().then(_data => setTableData(_data));
 
  }, [listedRegions]);
  
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
    return listing.timeslice_price * BigInt(listing.region.end - listing.region.begin)
  }

  return (
    <div className={styles.secondaryMarketPage}>
      <div className={styles.secondaryMarketTableContainer}>
        <div className={styles.secondaryMarketTableInner}>
          <div className={styles.tableWrapper}>
            <h2 className={styles.marketHeading}>Regions on sale</h2>

            <TableComponent data={tableData} pageSize={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
