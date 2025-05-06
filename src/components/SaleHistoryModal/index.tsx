import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { TableComponent } from '../elements/TableComponent';
import styles from './sale-history-modal.module.scss';
import { timesliceToTimestamp, blockToTimestamp, toUnitFormatted } from '@/utils';
import { $network, $connections } from '@/api/connection';
import { type SaleInfo as Sale } from '@/coretime/saleInfo';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';

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
  sale: Sale;
  purchases: Array<Record<string, TableData>>;
};

const SaleHistoryModal: React.FC<SaleHistoryModalProps> = ({
  open,
  onClose,
  saleId,
  sale,
  purchases,
}) => {
  const [regionBegin, setRegionBegin] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [startPrice, setStartPrice] = useState<string>('');
  const [endPrice, setEndPrice] = useState<string>('');
  const [saleStarted, setSaleStarted] = useState<string>('');

  const network = useUnit($network);
  const connections = useUnit($connections);

  useEffect(() => {
    if (!network || !sale) return;

    (async () => {
      const chainIds = getNetworkChainIds(network);
      if (!chainIds) return null;
      const connection = connections[chainIds.coretimeChain];
      if (!connection) return null;
      const metadata = getNetworkMetadata(network);
      if(!metadata) return;

      const regionBeginDate = await timesliceToTimestamp(sale.regionBegin, network, connections);
      const saleStartDate = await blockToTimestamp(sale.saleStart, connection, metadata.coretimeChain);

      setRegionBegin(regionBeginDate ? new Date(Number(regionBeginDate)).toLocaleString() : '-');
      setLength((sale.regionEnd - sale.regionBegin).toString());
      setStartPrice(toUnitFormatted(network, BigInt(sale.startPrice)));
      setEndPrice(toUnitFormatted(network, BigInt(sale.endPrice)));
      setSaleStarted(saleStartDate ? new Date(Number(saleStartDate)).toLocaleString() : '-');
    })();
  }, [sale, network, connections]);

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
        </div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Region Begin</span>
            <span className={styles.value}>{regionBegin}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Length</span>
            <span className={styles.value}>{length}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Start Price</span>
            <span className={styles.value}>{startPrice}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>End Price</span>
            <span className={styles.value}>{endPrice}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Sale Started</span>
            <span className={styles.value}>{saleStarted}</span>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <TableComponent data={purchases} pageSize={5} />
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
};

export default SaleHistoryModal;
