import React from 'react';
import styles from './TableRow.module.scss';
import Cell from '../Cell/Cell';

interface TableRowProps {
  data: Record<string, any>;
}

const TableRow: React.FC<TableRowProps> = ({ data }) => {
  return (
    <div className={styles['tableRow']}>
      {Object.keys(data).map((key, index) => (
        <div key={index} className={styles[`tableRow-cell`]}>
          <Cell cell={data[key]} />
        </div>
      ))}
    </div>
  );
};

export default TableRow;
