'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import Identicon from '@polkadot/react-identicon';
import { encodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import { $regions } from '@/coretime/regions';
import { $connections, $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { getNetworkSS58Prefix, timesliceToTimestamp, toUnitFormatted } from '@/utils';
import { TableComponent } from '@/components/elements/TableComponent';
import styles from './OwnedRegionsTable.module.scss';

type TableData = {
  cellType: 'text' | 'jsx';
  data: string | React.ReactElement;
  searchKey?: string;
};

export default function OwnedRegionsTable() {
  const [tableData, setTableData] = useState<Array<Record<string, TableData>>>([]);
  const [loading, setLoading] = useState(true);

  const [regions, network, connections, selectedAccount] = useUnit([
    $regions,
    $network,
    $connections,
    $selectedAccount,
  ]);

  useEffect(() => {
    const loadTableData = async () => {
      if (!selectedAccount) {
        setLoading(false);
        return;
      }

      const ownedRegions = regions.filter(
        (region) => encodeAddress(region.owner, 42) === encodeAddress(selectedAccount.address, 42)
      );

      const rows = await Promise.all(
        ownedRegions.map(async (region) => {
          const beginTs = await timesliceToTimestamp(region.begin, network, connections);
          const endTs = await timesliceToTimestamp(region.end, network, connections);
          const duration =
            beginTs && endTs
              ? `${Math.round((Number(endTs) - Number(beginTs)) / (1000 * 60 * 60 * 24))} days`
              : '-';

          const icon = (
            <Identicon
              value={encodeAddress(
                blake2AsU8a(`${region.begin}-${region.end}-${region.core}`),
                getNetworkSS58Prefix(network)
              )}
              size={24}
              style={{ borderRadius: '50%' }}
            />
          );

          const paidFormatted =
            region.paid !== undefined ? toUnitFormatted(network, BigInt(region.paid)) : '-';

          return {
            Region: {
              cellType: 'jsx' as const,
              data: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {icon}#{region.core}
                </span>
              ),
              searchKey: region.id,
            },
            Start: {
              cellType: 'text' as const,
              data: beginTs
                ? new Date(Number(beginTs)).toLocaleDateString()
                : `Timeslice #${region.begin}`,
            },
            End: {
              cellType: 'text' as const,
              data: endTs
                ? new Date(Number(endTs)).toLocaleDateString()
                : `Timeslice #${region.end}`,
            },
            Duration: {
              cellType: 'text' as const,
              data: duration,
            },
            Paid: {
              cellType: 'text' as const,
              data: paidFormatted,
            },
          };
        })
      );

      setTableData(rows);
      setLoading(false);
    };

    if (selectedAccount && regions.length > 0) {
      loadTableData();
    } else {
      setLoading(false);
    }
  }, [regions, network, connections, selectedAccount]);

  if (loading) return null;

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.heading}>My Regions</h2>
      {tableData.length > 0 ? (
        <TableComponent data={tableData} pageSize={5} />
      ) : (
        <div className={styles.noRegions}>You don’t currently own any regions.</div>
      )}
    </div>
  );
}
