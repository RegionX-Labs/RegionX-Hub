import React, { useEffect, useState, useCallback } from 'react';
import { useUnit } from 'effector-react';
import styles from './sale-history.module.scss';
import { TableComponent } from '../../../components/elements/TableComponent';
import SaleHistoryModal from '../../../components/SaleHistoryModal';
import { $saleHistory, saleHistoryRequested, type SaleInfo as Sale } from '@/coretime/saleInfo';
import {
  $purchaseHistory,
  purchaseHistoryRequested,
  PurchaseHistoryItem,
} from '@/coretime/purchaseHistory';
import { $network, $connections } from '@/api/connection';
import { timesliceToTimestamp, blockToTimestamp, toUnitFormatted } from '@/utils';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';

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

const SaleHistoryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [modalPurchases, setModalPurchases] = useState<Array<Record<string, TableData>>>([]);
  const [tableData, setTableData] = useState<Array<Record<string, TableData>>>([]);

  const network = useUnit($network);
  const saleInfo = useUnit($saleHistory);
  const connections = useUnit($connections);
  const purchaseHistory = useUnit($purchaseHistory);

  useEffect(() => {
    if (network) {
      saleHistoryRequested(network);
    }
  }, [network]);

  useEffect(() => {
    const processData = async () => {
      if (!network || !Array.isArray(saleInfo)) return;

      const chainIds = getNetworkChainIds(network);
      if (!chainIds) return;
      const connection =
        network === Network.WESTEND
          ? connections[chainIds.relayChain]
          : connections[chainIds.coretimeChain];
      if (!connection) return;
      const metadata = getNetworkMetadata(network);
      if (!metadata) return;

      const processed = await Promise.all(
        saleInfo.map(async (sale: Sale) => {
          const regionBeginTimestamp = await timesliceToTimestamp(
            sale.regionBegin,
            network,
            connections
          );
          const regionEndTimestamp = await timesliceToTimestamp(
            sale.regionEnd,
            network,
            connections
          );

          const saleStartTimestamp = await blockToTimestamp(
            sale.saleStart,
            connection,
            network === Network.WESTEND ? metadata.relayChain : metadata.coretimeChain,
            network
          );
          const saleEndTimestamp = sale.leadinLength
            ? await blockToTimestamp(
                sale.saleStart + sale.leadinLength,
                connection,
                network === Network.WESTEND ? metadata.relayChain : metadata.coretimeChain,
                network
              )
            : null;

          return {
            SaleId: {
              cellType: 'link' as const,
              data: String(sale.saleCycle),
              link: `/sales/${sale.saleCycle}`,
              searchKey: String(sale.saleCycle),
            },
            RegionBegin: {
              cellType: 'text' as const,
              data: formatDate(regionBeginTimestamp),
              searchKey: formatDate(regionBeginTimestamp),
            },
            RegionEnd: {
              cellType: 'text' as const,
              data: formatDate(regionEndTimestamp),
              searchKey: formatDate(regionEndTimestamp),
            },
            SaleStart: {
              cellType: 'text' as const,
              data: formatDate(saleStartTimestamp),
              searchKey: formatDate(saleStartTimestamp),
            },
            SaleEnd: {
              cellType: 'text' as const,
              data: formatDate(saleEndTimestamp),
              searchKey: formatDate(saleEndTimestamp),
            },
          };
        })
      );

      setTableData(processed);
    };

    processData();
  }, [saleInfo, network, connections]);

  const handleSaleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/sales/')) {
        e.preventDefault();
        const saleId = target.getAttribute('href')?.split('/sales/')[1];
        if (saleId && network) {
          const id = parseInt(saleId, 10);
          setSelectedSaleId(id);
          setModalOpen(true);
          purchaseHistoryRequested({ network, saleCycle: id });
        }
      }
    },
    [network]
  );

  useEffect(() => {
    if (!network) return;

    const formatted = purchaseHistory.map((purchase: PurchaseHistoryItem) => ({
      ExtrinsicID: {
        cellType: 'link' as const,
        data: purchase.extrinsicId,
        link: '#',
        searchKey: purchase.extrinsicId,
      },
      Account: {
        cellType: 'address' as const,
        data: purchase.address,
        searchKey: purchase.address,
      },
      Core: {
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

    setModalPurchases(formatted);
  }, [purchaseHistory, network]);

  return (
    <div className={styles.sale_history_table}>
      <h2 className={styles.heading}>Historical sales</h2>
      <p className={styles.subheading}>Shows the full sale history</p>

      <div className={styles.tableWrapper} onClick={handleSaleClick}>
        <TableComponent data={tableData} pageSize={8} />
      </div>

      {modalOpen &&
        selectedSaleId !== null &&
        (() => {
          const sale = saleInfo.find((s) => s.saleCycle === selectedSaleId);
          if (!sale) return null;

          return (
            <SaleHistoryModal
              open={modalOpen}
              saleId={selectedSaleId}
              sale={sale}
              purchases={modalPurchases}
              onClose={() => setModalOpen(false)}
            />
          );
        })()}
    </div>
  );
};

export default SaleHistoryPage;
