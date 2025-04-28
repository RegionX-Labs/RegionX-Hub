import React, { useState } from 'react';
import styles from './Pagination.module.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  setPage: (_page: number) => void;
  pageSize: number;
  dataLength: number;
  onPageChange: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  setPage,
  pageSize,
  dataLength,
  onPageChange,
}) => {
  const totalPages = Math.ceil(dataLength / pageSize);
  const [currentWindowStart, setCurrentWindowStart] = useState(1); // track window start

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    onPageChange(newPage);
  };

  const handleWindowShift = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWindowStart((prev) => Math.max(1, prev - 4));
    } else {
      setCurrentWindowStart((prev) => Math.min(prev + 4, Math.max(1, totalPages - 3)));
    }
  };

  const pages = Array.from(
    { length: Math.min(4, totalPages - currentWindowStart + 1) },
    (_, i) => currentWindowStart + i
  );

  return (
    <div className={styles['pagination-container']}>
      <button onClick={() => handleWindowShift('prev')} className={styles.pageButton}>
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`${styles.pageButton} ${p === page ? styles.active : ''}`}
        >
          {p}
        </button>
      ))}

      <button onClick={() => handleWindowShift('next')} className={styles.pageButton}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default TablePagination;
