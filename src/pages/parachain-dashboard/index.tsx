import React, { useState } from 'react';
import styles from './dashboard.module.scss';
import { TableComponent, LabelCard } from '@region-x/components';
import { FaStar } from 'react-icons/fa';

const ParachainDashboard = () => {
  const [watchlistStatus, setWatchlistStatus] = useState<Record<string, boolean>>({
    '1000': false,
    '1001': false,
    '1002': false,
    '1003': false,
    '10004': false,
  });

  const toggleWatchlist = (id: string) => {
    setWatchlistStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const tableData: Record<
    string,
    { cellType: 'text' | 'link' | 'address' | 'jsx'; data: string | React.ReactElement }
  >[] = [
    {
      Name: { cellType: 'text', data: 'Acala' },
      Id: { cellType: 'text', data: '1000' },
      State: {
        cellType: 'jsx',
        data: <LabelCard label='Active' />,
      },
      Expiry: { cellType: 'text', data: '2025-06-01' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlistStatus['1000'] ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist('1000')}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Moonbeam' },
      Id: { cellType: 'text', data: '1001' },
      State: {
        cellType: 'jsx',
        data: <LabelCard label='Active' />,
      },
      Expiry: { cellType: 'text', data: '2025-09-12' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlistStatus['1001'] ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist('1001')}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Parallel' },
      Id: { cellType: 'text', data: '1002' },
      State: {
        cellType: 'jsx',
        data: <LabelCard label='Inactive' />,
      },
      Expiry: { cellType: 'text', data: '2024-12-30' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlistStatus['1002'] ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist('1002')}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Astar' },
      Id: { cellType: 'text', data: '1003' },
      State: {
        cellType: 'jsx',
        data: <LabelCard label='Active' />,
      },
      Expiry: { cellType: 'text', data: '2026-03-15' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlistStatus['1003'] ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist('1003')}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Phala' },
      Id: { cellType: 'text', data: '10004' },
      State: {
        cellType: 'jsx',
        data: <LabelCard label='Active' />,
      },
      Expiry: { cellType: 'text', data: '2025-11-10' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlistStatus['10004'] ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist('10004')}
          />
        ),
      },
    },
  ];

  return (
    <>
      <div className={styles.buttonContainer}>
        <button className={styles.customButton}>Watchlist Only</button>
        <button className={`${styles.customButton} ${styles.secondary}`}>Reserve New Para</button>
      </div>
      <div className={styles.dashboard_table}>
        <div className={styles.tableWrapper}>
          <TableComponent data={tableData} pageSize={5} />
        </div>
      </div>
    </>
  );
};

export default ParachainDashboard;
