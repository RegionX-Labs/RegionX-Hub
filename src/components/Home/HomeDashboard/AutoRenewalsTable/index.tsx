'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { TableComponent } from '@/components/elements/TableComponent';
import styles from './AutoRenewalsTable.module.scss';
import { fetchAutoRenewals } from '@/coretime/renewals';
import { $connections, $network } from '@/api/connection';
import { encodeAddress } from '@polkadot/util-crypto';

type TableData = {
  cellType: 'text' | 'address' | 'jsx';
  data: string | React.ReactElement;
  searchKey?: string;
};

export default function AutoRenewalsTable() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const [tableData, setTableData] = useState<Array<Record<string, TableData>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAutoRenewals = async () => {
      if (!network || !connections) return;

      setLoading(true);
      const autoRenewalsMap = await fetchAutoRenewals(network, connections);

      const formatted = Array.from(autoRenewalsMap.entries()).map(([paraId, isEnabled]) => ({
        ParaID: {
          cellType: 'text' as const,
          data: paraId,
          searchKey: paraId,
        },
        Status: {
          cellType: 'text' as const,
          data: isEnabled ? 'Enabled' : 'Disabled',
          searchKey: isEnabled ? 'Enabled' : 'Disabled',
        },
      }));

      setTableData(formatted);
      setLoading(false);
    };

    loadAutoRenewals();
  }, [network, connections]);

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.heading}>Parachains with Auto Renewals</h2>
      {loading ? <div>Loading...</div> : <TableComponent data={tableData} pageSize={5} />}
    </div>
  );
}
