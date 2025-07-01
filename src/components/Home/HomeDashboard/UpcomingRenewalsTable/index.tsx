'use client';

import React, { useEffect, useState } from 'react';
import styles from './UpcomingRenewalsTable.module.scss';
import { useUnit } from 'effector-react';
import { $network, $connections } from '@/api/connection';
import { $parachains, parachainsRequested } from '@/parachains';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
} from '@/coretime/renewals';
import { chainData } from '@/chaindata';
import { TableComponent } from '@/components/elements/TableComponent';
import { TableData } from '@/types/type';
import { timesliceToTimestamp, toUnitFormatted } from '@/utils';

const UpcomingRenewalsTable = () => {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const parachains = useUnit($parachains);
  const potentialRenewals = useUnit($potentialRenewals);
  const [tableData, setTableData] = useState<Record<string, TableData>[]>([]);

  useEffect(() => {
    parachainsRequested(network);
    potentialRenewalsRequested({ network, connections });
  }, [network, connections]);

  useEffect(() => {
    const loadTableData = async () => {
      const entries = Array.from(potentialRenewals.entries());

      const rows: Record<string, TableData>[] = [];

      for (const [key, record] of entries) {
        const assignment = (record.completion as any)?.value?.[0]?.assignment?.value;
        if (!assignment) continue;

        const paraId = assignment;
        const logo = chainData[network]?.[paraId]?.logo;
        const name = chainData[network]?.[paraId]?.name ?? `Parachain ${paraId}`;
        const cost = toUnitFormatted(network, BigInt(record.price));

        const deadlineDate = await timesliceToTimestamp(key.when, network, connections);
        const deadline = deadlineDate ? new Date(Number(deadlineDate)).toLocaleString() : 'Unknown';

        rows.push({
          ParaId: {
            cellType: 'text' as const,
            data: paraId.toString(),
          },
          Name: {
            cellType: 'jsx' as const,
            data: (
              <div className={styles.parachainNameContainer}>
                {logo ? (
                  <img src={logo} alt='' width={28} height={28} style={{ borderRadius: '50%' }} />
                ) : (
                  <div className={styles.logoFallback} />
                )}
                <span>{name}</span>
              </div>
            ),
            searchKey: name,
          },
          Deadline: {
            cellType: 'text' as const,
            data: deadline,
          },
          Cost: {
            cellType: 'text' as const,
            data: `${cost}`,
          },
        });
      }

      setTableData(rows);
    };

    loadTableData();
  }, [potentialRenewals, network, connections]);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>Parachains Needing Renewal</h3>
      <div className={styles.tableContainer}>
        <TableComponent data={tableData} pageSize={6} />
      </div>
    </div>
  );
};

export default UpcomingRenewalsTable;
