'use client';

import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { TableComponent } from '../../../elements/TableComponent';
import styles from './PurchaseHistory.module.scss';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import {
  $purchaseHistory,
  purchaseHistoryRequested,
  PurchaseHistoryItem,
} from '@/coretime/purchaseHistory';
import { $network } from '@/api/connection';
import { toUnitFormatted } from '@/utils';

type NetworkType = 'polkadot' | 'kusama' | 'paseo' | 'rococo' | 'westend' | 'none';

const SUSBCAN_CORETIME_URL: Record<NetworkType, string> = {
  polkadot: 'https://coretime-polkadot.subscan.io',
  kusama: 'https://coretime-kusama.subscan.io',
  paseo: 'https://coretime-paseo.subscan.io',
  rococo: 'https://coretime-rococo.subscan.io',
  westend: 'https://coretime-westend.subscan.io',
  none: '',
};

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

const formatDate = (timestamp: Date | bigint | null): string => {
  if (!timestamp) return '-';
  const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp));
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function PurchaseHistoryTable() {
  const network = useUnit($network);
  const latestSaleInfo = useUnit($latestSaleInfo);
  const purchaseHistory = useUnit($purchaseHistory);
  const [tableData, setTableData] = useState<Array<Record<string, TableData>>>([]);

  useEffect(() => {
    if (network && latestSaleInfo) {
      purchaseHistoryRequested({
        network,
        saleCycle: latestSaleInfo.saleCycle,
      });
    }
  }, [network, latestSaleInfo]);

  useEffect(() => {
    if (!network) return;

    const baseUrl = SUSBCAN_CORETIME_URL[network as NetworkType] || 'https://subscan.io';

    const formatted = purchaseHistory.map((purchase: PurchaseHistoryItem) => ({
      ExtrinsicID: {
        cellType: 'link' as const,
        data: purchase.extrinsicId,
        link: `${baseUrl}/extrinsic/${purchase.extrinsicId}`,
        searchKey: purchase.extrinsicId,
      },
      Account: {
        cellType: 'address' as const,
        data: purchase.address,
        searchKey: purchase.address,
      },
      CoreID: {
        cellType: 'text' as const,
        data: String(purchase.core),
        searchKey: String(purchase.core),
      },
      Price: {
        cellType: 'text' as const,
        data: toUnitFormatted(network, BigInt(purchase.price)),
        searchKey: String(purchase.price),
      },
      SalesType: {
        cellType: 'text' as const,
        data: purchase.type,
        searchKey: purchase.type,
      },
      Timestamp: {
        cellType: 'text' as const,
        data: formatDate(purchase.timestamp),
        searchKey: formatDate(purchase.timestamp),
      },
    }));

    setTableData(formatted);
  }, [purchaseHistory, network]);

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.heading}>Latest Purchase History</h2>
      <TableComponent data={tableData} pageSize={5} />
    </div>
  );
}
