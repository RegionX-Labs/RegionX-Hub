import React, { useEffect } from 'react';
import styles from './secondary-market.module.scss';
import { TableComponent } from '../../components/elements/TableComponent';
import { $listedRegions, listedRegionsRequested } from '@/marketplace';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';

export default function SecondaryMarket() {
  const [network, connections, listedRegions] = useUnit([$network, $connections, $listedRegions]);

  useEffect(() => {
    listedRegionsRequested({network, connections});
  }, [network, connections]);

  const tableData = listedRegions.map((listing) => {
    return {
      CoreId: { cellType: 'text' as const, data: listing.regionId.core.toString() },
      Timeline: { cellType: 'text' as const, data: `${listing.regionId.begin} - todo` },
      Price: { cellType: 'text' as const, data: '42 DOT' }, // TODO: need region end for this.
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '60%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    }
  });

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
