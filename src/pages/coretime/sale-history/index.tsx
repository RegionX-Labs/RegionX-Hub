import React, { useEffect, useState, useCallback } from 'react';
import { useUnit } from 'effector-react';
import styles from './sale-history.module.scss';
import { TableComponent } from '@region-x/components';
import SaleHistoryModal from '../../../components/SaleHistoryModal';
import { $saleHistory, saleHistoryRequested, type SaleInfo as Sale } from '@/coretime/saleInfo';
import { $network, $connections } from '@/api/connection';
import { timesliceToTimestamp, blockToTimestamp } from '@/utils';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

const formatDate = (timestamp: bigint | null): string => {
  if (!timestamp) return '-';
  const date = new Date(Number(timestamp));
  return date.toLocaleString();
};

const SaleHistoryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [tableData, setTableData] = useState<Array<Record<string, TableData>>>([]);

  const network = useUnit($network);
  const saleInfo = useUnit($saleHistory);
  const connections = useUnit($connections);

  useEffect(() => {
    if (network) {
      saleHistoryRequested(network);
    }
  }, [network]);

  useEffect(() => {
    const processData = async () => {
      if (!network || !Array.isArray(saleInfo)) return;

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
          const saleStartTimestamp = await blockToTimestamp(sale.saleStart, network, connections);
          const saleEndTimestamp = sale.leadinLength
            ? await blockToTimestamp(sale.saleStart + sale.leadinLength, network, connections)
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

  const handleSaleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/sales/')) {
      e.preventDefault();
      const saleId = target.getAttribute('href')?.split('/sales/')[1];
      if (saleId) {
        setSelectedSaleId(parseInt(saleId, 10));
        setModalOpen(true);
      }
    }
  }, []);

  return (
    <div className={styles.sale_history_table}>
      <h2 className={styles.heading}>Historical sales</h2>
      <p className={styles.subheading}>Shows the full sale history</p>

      <div className={styles.tableWrapper} onClick={handleSaleClick}>
        <TableComponent data={tableData} pageSize={8} />
      </div>

      {modalOpen && selectedSaleId !== null && (
        <SaleHistoryModal
          open={modalOpen}
          saleId={selectedSaleId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SaleHistoryPage;
