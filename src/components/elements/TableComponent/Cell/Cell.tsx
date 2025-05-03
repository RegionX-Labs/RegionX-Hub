import React from 'react';
import styles from './Cell.module.scss';
import Identicon from '@polkadot/react-identicon';
import { TableData } from '../../../../types/type';

const Cell: React.FC<{ cell: TableData }> = ({ cell }) => {
  const formatAccountString = (account: string): string => {
    if (account.length <= 19) return account;
    const firstPart = account.slice(0, 6);
    const lastPart = account.slice(-4);
    return `${firstPart}...${lastPart}`;
  };

  switch (cell.cellType) {
    case 'text':
      return <p>{cell.data}</p>;
    case 'link':
      return (
        <a target='_target' href={cell.link}>
          {cell.data}
        </a>
      );
    case 'address':
      return (
        <>
          <span className={styles.addressCellIcons}>
            <Identicon value={cell.data as string} size={20} className={styles.identicon} />
          </span>
          <a target='_target' href={cell.link}>
            {formatAccountString(cell.data as string)}
          </a>
        </>
      );
    case 'jsx':
      return cell.data;
    default:
      return null;
  }
};

export default Cell;
