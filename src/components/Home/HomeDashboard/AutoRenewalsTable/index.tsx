'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { TableComponent } from '@/components/elements/TableComponent';
import styles from './AutoRenewalsTable.module.scss';
import { fetchAutoRenewals } from '@/coretime/renewals';
import { $connections, $network } from '@/api/connection';
import { chainData } from '@/chaindata';
import { timesliceToTimestamp } from '@/utils';

type TableData = {
  cellType: 'text' | 'address' | 'jsx';
  data: string | React.ReactElement;
  searchKey?: string;
};

export default function AutoRenewalsTable() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const [tableData, setTableData] = useState<Record<string, TableData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAutoRenewals = async () => {
      if (!network || !connections) return;

      setLoading(true);
      const autoRenewals = await fetchAutoRenewals(network, connections);

      const formatted: Record<string, TableData>[] = await Promise.all(
        autoRenewals.map(async (entry) => {
          const chainInfo = chainData[network]?.[entry.task];
          const nextRenewalTs = await timesliceToTimestamp(
            entry.next_renewal,
            network,
            connections
          );
          const formattedDate = nextRenewalTs
            ? new Date(Number(nextRenewalTs)).toLocaleString()
            : 'N/A';

          return {
            Parachain: {
              cellType: 'jsx',
              data: (
                <div className={styles.parachainNameContainer}>
                  {chainInfo?.logo ? (
                    <img
                      src={chainInfo.logo}
                      alt=''
                      width={32}
                      height={32}
                      style={{ borderRadius: '100%' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '100%',
                        backgroundColor: '#8899A8',
                      }}
                    />
                  )}
                  <p>{chainInfo?.name || `Para ID ${entry.task}`}</p>
                </div>
              ),
              searchKey: chainInfo?.name || entry.task.toString(),
            },
            Core: {
              cellType: 'text',
              data: entry.core.toString(),
              searchKey: entry.core.toString(),
            },
            'Next Renewal': {
              cellType: 'text',
              data: formattedDate,
              searchKey: formattedDate,
            },
          };
        })
      );

      setTableData(formatted);
      setLoading(false);
    };

    loadAutoRenewals();
  }, [network, connections]);

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.heading}>Parachains with Auto Renewals</h2>
      {loading ? <div></div> : <TableComponent data={tableData} pageSize={5} />}
    </div>
  );
}
