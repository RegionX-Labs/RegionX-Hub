import React, { useState, useCallback } from 'react';
import styles from './sale-history.module.scss';
import { TableComponent } from '@region-x/components';
import SaleHistoryModal from '../../../components/SakeHistoryModal';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

const tableData: Array<Record<string, TableData>> = [
  {
    SaleId: {
      cellType: 'link',
      data: '7',
      link: '/sales/7',
      searchKey: '7',
    },
    RegionBegin: { cellType: 'text', data: '317805', searchKey: '317805' },
    RegionEnd: { cellType: 'text', data: '322845', searchKey: '322845' },
    SaleStart: { cellType: 'text', data: '1299374', searchKey: '1299374' },
    SaleEnd: { cellType: 'text', data: '-', searchKey: '-' },
  },
  {
    SaleId: {
      cellType: 'link',
      data: '6',
      link: '/sales/6',
      searchKey: '6',
    },
    RegionBegin: { cellType: 'text', data: '312765', searchKey: '312765' },
    RegionEnd: { cellType: 'text', data: '317805', searchKey: '317805' },
    SaleStart: { cellType: 'text', data: '1099342', searchKey: '1099342' },
    SaleEnd: { cellType: 'text', data: '1299374', searchKey: '1299374' },
  },
  {
    SaleId: {
      cellType: 'link',
      data: '5',
      link: '/sales/5',
      searchKey: '5',
    },
    RegionBegin: { cellType: 'text', data: '307725', searchKey: '307725' },
    RegionEnd: { cellType: 'text', data: '312765', searchKey: '312765' },
    SaleStart: { cellType: 'text', data: '899402', searchKey: '899402' },
    SaleEnd: { cellType: 'text', data: '1099342', searchKey: '1099342' },
  },
  {
    SaleId: {
      cellType: 'link',
      data: '4',
      link: '/sales/4',
      searchKey: '4',
    },
    RegionBegin: { cellType: 'text', data: '302685', searchKey: '302685' },
    RegionEnd: { cellType: 'text', data: '307725', searchKey: '307725' },
    SaleStart: { cellType: 'text', data: '700014', searchKey: '700014' },
    SaleEnd: { cellType: 'text', data: '899402', searchKey: '899402' },
  },
  {
    SaleId: {
      cellType: 'link',
      data: '3',
      link: '/sales/3',
      searchKey: '3',
    },
    RegionBegin: { cellType: 'text', data: '297645', searchKey: '297645' },
    RegionEnd: { cellType: 'text', data: '302685', searchKey: '302685' },
    SaleStart: { cellType: 'text', data: '500734', searchKey: '500734' },
    SaleEnd: { cellType: 'text', data: '700014', searchKey: '700014' },
  },
  {
    SaleId: {
      cellType: 'link',
      data: '2',
      link: '/sales/2',
      searchKey: '2',
    },
    RegionBegin: { cellType: 'text', data: '292605', searchKey: '292605' },
    RegionEnd: { cellType: 'text', data: '297645', searchKey: '297645' },
    SaleStart: { cellType: 'text', data: '301117', searchKey: '301117' },
    SaleEnd: { cellType: 'text', data: '500734', searchKey: '500734' },
  },
];

const SaleHistoryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

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
