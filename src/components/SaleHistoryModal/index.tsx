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
  purchases: Array<Record<string, TableData>>;
};

const SaleHistoryModal: React.FC<SaleHistoryModalProps> = ({
  open,
  onClose,
  saleId,
  purchases,
}) => {
  if (!open) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <div className={styles.header}>
          <h2 className={styles.title}>Coretime Sale #{saleId}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <TableComponent data={purchases} pageSize={5} />
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
