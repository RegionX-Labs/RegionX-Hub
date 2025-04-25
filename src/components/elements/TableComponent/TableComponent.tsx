import React, { useEffect, useState } from 'react';
import styles from './TableComponent.module.scss';
import { TableRow } from './index';
import SearchIcon from '../../../../public/Search.svg';
import { TableData, TableProps } from '../../../types/type';
import TablePagination from './Pagination';
import Image from 'next/image';

const TableComponent: React.FC<TableProps> = ({ data, pageSize }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [displayedData, setDisplayedData] = useState(filteredData.slice(0, pageSize));

  const [page, setPage] = useState(1);

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>(
    Object.keys(data[0] || {}).reduce(
      (acc, key) => {
        acc[key] = '';
        return acc;
      },
      {} as Record<string, string>
    )
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
    const newSearchTerms = { ...searchTerms, [column]: e.target.value };
    setSearchTerms(newSearchTerms);
    setPage(1);
    filterData(newSearchTerms);
  };

  const filterData = (searchTerms: Record<string, string>) => {
    const filtered = data.filter((row) =>
      Object.keys(searchTerms).every(
        (key) =>
          String(row[key]?.data || '')
            .toLowerCase()
            .includes(searchTerms[key].toLowerCase()) ||
          String(row[key]?.searchKey || '')
            .toLowerCase()
            .includes(searchTerms[key].toLowerCase())
      )
    );
    setFilteredData(filtered);
    setDisplayedData(getPaginatedData(filtered, 1));
  };

  useEffect(() => {
    filterData(searchTerms);
  }, [data]);

  const onPageChange = (_page: number) => {
    setPage(_page);
    setDisplayedData(getPaginatedData(filteredData, _page));
  };

  const getPaginatedData = (data: Record<string, TableData>[], page: number) =>
    data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={styles['tableWrapper']}>
      <div className={styles['tableHeader']}>
        {Object.keys(data[0] || {}).map((key, index) => (
          <div
            key={index}
            className={`${styles['tableHeader-cell']} ${data[0][key]?.cellType ? styles[data[0][key]?.cellType] : ''}`}
          >
            <p>{key}</p>
            <input
              type='text'
              value={searchTerms[key]}
              onChange={(e) => handleSearchChange(e, key)}
            />
            <Image src={SearchIcon} alt='Down Arrow' className={styles.searchIcon} />{' '}
          </div>
        ))}
      </div>
      <div className={styles['tableBody']}>
        {displayedData.length === 0 ? (
          <div className={styles['noResultsMessage']}>No results found.</div>
        ) : (
          displayedData.map((row, rowIndex) => <TableRow key={rowIndex} data={row} />)
        )}
      </div>
      <TablePagination
        page={page}
        setPage={setPage}
        dataLength={filteredData.length}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default TableComponent;
