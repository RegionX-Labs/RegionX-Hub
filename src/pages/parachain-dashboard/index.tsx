import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.scss';
import { TableComponent } from '@region-x/components';
import { FaStar } from 'react-icons/fa';
import { ParaStateCard } from './ParaStateCard/index';
import { ParaState } from './paras';

const ParachainDashboard = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);

  const toggleWatchlist = (id: number) => {
    setWatchlist((prev) => {
      const updatedWatchlist = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      try {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        if (Array.isArray(parsedWatchlist)) {
          setWatchlist(parsedWatchlist);
        }
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
      }
    }
  }, []);

  const tableData: Record<
    string,
    { cellType: 'text' | 'link' | 'address' | 'jsx'; data: string | React.ReactElement }
  >[] = [
    {
      Name: { cellType: 'text', data: 'Acala' },
      Id: { cellType: 'text', data: '1000' },
      State: {
        cellType: 'jsx',
        data: <ParaStateCard state={ParaState.ACTIVE_PARA} />,
      },
      Expiry: { cellType: 'text', data: '2025-06-01' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlist.includes(1000) ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist(1000)}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Moonbeam' },
      Id: { cellType: 'text', data: '1001' },
      State: {
        cellType: 'jsx',
        data: <ParaStateCard state={ParaState.RESERVED} />,
      },
      Expiry: { cellType: 'text', data: '2025-09-12' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlist.includes(1001) ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist(1001)}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Parallel' },
      Id: { cellType: 'text', data: '1002' },
      State: {
        cellType: 'jsx',
        data: <ParaStateCard state={ParaState.IDLE_PARA} />,
      },
      Expiry: { cellType: 'text', data: '2024-12-30' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlist.includes(1002) ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist(1002)}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Astar' },
      Id: { cellType: 'text', data: '1003' },
      State: {
        cellType: 'jsx',
        data: <ParaStateCard state={ParaState.ACTIVE_PARA} />,
      },
      Expiry: { cellType: 'text', data: '2026-03-15' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlist.includes(1003) ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist(1003)}
          />
        ),
      },
    },
    {
      Name: { cellType: 'text', data: 'Phala' },
      Id: { cellType: 'text', data: '1004' },
      State: {
        cellType: 'jsx',
        data: <ParaStateCard state={ParaState.ACTIVE_PARA} />,
      },
      Expiry: { cellType: 'text', data: '2025-11-10' },
      Watchlist: {
        cellType: 'jsx',
        data: (
          <FaStar
            className={`${styles.starIcon} ${watchlist.includes(1004) ? styles.starActive : ''}`}
            onClick={() => toggleWatchlist(1004)}
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
