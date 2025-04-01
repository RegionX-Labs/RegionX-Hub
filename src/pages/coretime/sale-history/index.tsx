import React, { useEffect, useState, useCallback } from 'react';
import { useUnit } from 'effector-react';
import styles from './sale-history.module.scss';
import { TableComponent } from '@region-x/components';
import SaleHistoryModal from '../../../components/SakeHistoryModal';
import { $saleHistory, saleHistoryRequested, type SaleInfo as Sale } from '@/coretime/saleInfo';
import { $network } from '@/api/connection';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

const SaleHistoryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  const network = useUnit($network);
  const saleInfo = useUnit($saleHistory);

  useEffect(() => {
    if (network) {
      saleHistoryRequested(network);
    }
  }, [network]);

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

  const tableData: Array<Record<string, TableData>> = Array.isArray(saleInfo)
    ? saleInfo.map((sale: Sale) => ({
        SaleId: {
          cellType: 'link',
          data: String(sale.saleCycle),
          link: `/sales/${sale.saleCycle}`,
          searchKey: String(sale.saleCycle),
        },
        RegionBegin: {
          cellType: 'text',
          data: String(sale.regionBegin),
          searchKey: String(sale.regionBegin),
        },
        RegionEnd: {
          cellType: 'text',
          data: String(sale.regionEnd),
          searchKey: String(sale.regionEnd),
        },
        SaleStart: {
          cellType: 'text',
          data: String(sale.saleStart),
          searchKey: String(sale.saleStart),
        },
        SaleEnd: {
          cellType: 'text',
          data: sale.leadinLength ? String(sale.saleStart + sale.leadinLength) : '-',
          searchKey: sale.leadinLength ? String(sale.saleStart + sale.leadinLength) : '-',
        },
      }))
    : [];

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
