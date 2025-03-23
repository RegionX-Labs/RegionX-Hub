import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.scss';
import { TableComponent } from '@region-x/components';
import { FaStar } from 'react-icons/fa';
import { useUnit } from 'effector-react';
import { Network } from '@/types';
import { $connections, $network } from '@/api/connection';
import { ParaState, ParaStateCard } from '@/components/ParaStateCard';
import { parachainsRequested } from '@/parachains';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

const ParachainDashboard = () => {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const network = useUnit($network);
  const connections = useUnit($connections);

  const toggleWatchlist = (id: number) => {
    const watchlistKey = `watchlist_${network}`;
    setWatchlist((prev) => {
      const updatedWatchlist = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem(watchlistKey, JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  useEffect(() => {
    const watchlistKey = `watchlist_${network}`;
    const savedWatchlist = localStorage.getItem(watchlistKey);
    if (savedWatchlist) {
      try {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        if (Array.isArray(parsedWatchlist)) {
          setWatchlist(parsedWatchlist);
        }
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
      }
    } else {
      setWatchlist([]);
    }
  }, [network]);

  useEffect(() => {
    parachainsRequested(network);
  }, [network, connections]);

  const allData = [
    {
      id: 1000,
      name: 'Acala',
      state: ParaState.ACTIVE_PARA,
      expiry: '2025-06-01',
      network: Network.POLKADOT,
    },
    {
      id: 1000,
      name: 'Karura',
      state: ParaState.ACTIVE_PARA,
      expiry: '2025-06-01',
      network: Network.KUSAMA,
    },
    {
      id: 1001,
      name: 'Moonbeam',
      state: ParaState.RESERVED,
      expiry: '2025-09-12',
      network: Network.POLKADOT,
    },
    {
      id: 1001,
      name: 'Moonriver',
      state: ParaState.RESERVED,
      expiry: '2025-09-12',
      network: Network.KUSAMA,
    },
    {
      id: 1002,
      name: 'Parallel',
      state: ParaState.IDLE_PARA,
      expiry: '2024-12-30',
      network: Network.POLKADOT,
    },
    {
      id: 1002,
      name: 'Heiko',
      state: ParaState.IDLE_PARA,
      expiry: '2024-12-30',
      network: Network.KUSAMA,
    },
  ];

  const filteredData = showWatchlist
    ? allData.filter((item) => watchlist.includes(item.id) && item.network === network)
    : allData.filter((item) => item.network === network);

  const tableData: Record<string, TableData>[] = filteredData.map((item) => ({
    Name: { cellType: 'text' as const, data: item.name },
    Id: { cellType: 'text' as const, data: item.id.toString() },
    State: { cellType: 'jsx' as const, data: <ParaStateCard state={item.state} /> },
    Expiry: { cellType: 'text' as const, data: item.expiry },
    Watchlist: {
      cellType: 'jsx' as const,
      data: (
        <FaStar
          className={`${styles.starIcon} ${watchlist.includes(item.id) ? styles.starActive : ''}`}
          onClick={() => toggleWatchlist(item.id)}
        />
      ),
    },
  }));

  return (
    <>
      <div className={styles.buttonContainer}>
        <button className={styles.customButton} onClick={() => setShowWatchlist(!showWatchlist)}>
          {showWatchlist ? 'Show All' : 'Watchlist'}
        </button>
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
