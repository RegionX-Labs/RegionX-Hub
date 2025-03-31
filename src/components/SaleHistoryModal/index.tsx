import React from 'react';
import { TableComponent } from '@region-x/components';
import styles from './sale-history-modal.module.scss';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

type SaleHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  saleId: number;
};

const modalTableData: Record<string, TableData>[] = [
  {
    ExtrinsicID: {
      cellType: 'link',
      data: '1396628-2',
      link: '#',
      searchKey: '1396628-2',
    },
    Account: {
      cellType: 'address',
      data: '15Jp1...Dcj8',
      searchKey: '15Jp1...Dcj8',
    },
    Core: {
      cellType: 'text',
      data: '61',
      searchKey: '61',
    },
    Price: {
      cellType: 'text',
      data: '0.922',
      searchKey: '0.922',
    },
    SalesType: {
      cellType: 'text',
      data: 'bulk',
      searchKey: 'bulk',
    },
    Timestamp: {
      cellType: 'text',
      data: '10 days ago',
      searchKey: '10 days ago',
    },
  },
  {
    ExtrinsicID: {
      cellType: 'link',
      data: '1396628-2',
      link: '#',
      searchKey: '1396628-2',
    },
    Account: {
      cellType: 'address',
      data: '15Jp1...Dcj8',
      searchKey: '15Jp1...Dcj8',
    },
    Core: {
      cellType: 'text',
      data: '61',
      searchKey: '61',
    },
    Price: {
      cellType: 'text',
      data: '0.922',
      searchKey: '0.922',
    },
    SalesType: {
      cellType: 'text',
      data: 'bulk',
      searchKey: 'bulk',
    },
    Timestamp: {
      cellType: 'text',
      data: '10 days ago',
      searchKey: '10 days ago',
    },
  },
  {
    ExtrinsicID: {
      cellType: 'link',
      data: '1396628-2',
      link: '#',
      searchKey: '1396628-2',
    },
    Account: {
      cellType: 'address',
      data: '15Jp1...Dcj8',
      searchKey: '15Jp1...Dcj8',
    },
    Core: {
      cellType: 'text',
      data: '61',
      searchKey: '61',
    },
    Price: {
      cellType: 'text',
      data: '0.922',
      searchKey: '0.922',
    },
    SalesType: {
      cellType: 'text',
      data: 'bulk',
      searchKey: 'bulk',
    },
    Timestamp: {
      cellType: 'text',
      data: '10 days ago',
      searchKey: '10 days ago',
    },
  },
];

const SaleHistoryModal: React.FC<SaleHistoryModalProps> = ({ open, onClose, saleId }) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Coretime Sale#{saleId}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Region Begin</span>
            <span className={styles.value}>317,805</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Length</span>
            <span className={styles.value}>5,040</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Start Price</span>
            <span className={styles.value}>5.64 DOT</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>End Price</span>
            <span className={styles.value}>0.0564 DOT</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Sale Started</span>
            <span className={styles.value}>Mar 06 22:40</span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <TableComponent data={modalTableData} pageSize={5} />
        </div>
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.closeButtonBottom}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleHistoryModal;
