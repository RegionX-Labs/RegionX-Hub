import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.scss';
import { TableComponent } from '@region-x/components';
import { FaStar } from 'react-icons/fa';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { ParaStateCard } from '@/components/ParaStateCard';
import { $parachains, parachainsRequested } from '@/parachains';
import { chainData } from '@/chaindata';

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
  const parachains = useUnit($parachains);

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

  const filteredData = showWatchlist
    ? parachains.filter((item) => watchlist.includes(item.id) && item.network === network)
    : parachains.filter((item) => item.network === network);

  const tableData: Record<string, TableData>[] = filteredData.map((item) => ({
    Id: { cellType: 'text' as const, data: item.id.toString() },
    Name: {
      cellType: 'jsx' as const,
      data: (
        <div className={styles.parachainNameContainer}>
          {chainData[network][item.id]?.logo ? (
            <img
              src={chainData[network][item.id].logo}
              alt=''
              width={32}
              height={32}
              style={{ borderRadius: '100%' }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '100%',
                backgroundColor: '#8899A8',
              }}
            />
          )}
          <p>{chainData[network][item.id]?.name}</p>
        </div>
      ),
    },
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
          <TableComponent data={tableData} pageSize={8} />
        </div>
      </div>
    </>
  );
};

export default ParachainDashboard;
