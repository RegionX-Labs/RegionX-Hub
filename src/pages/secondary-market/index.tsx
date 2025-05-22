import React from 'react';
import styles from './secondary-market.module.scss';
import { TableComponent } from '../../components/elements/TableComponent';

export default function SecondaryMarket() {
  const tableData = [
    {
      CoreId: { cellType: 'text' as const, data: '#1045' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '60%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1046' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Full Core' },
      CorePercentage: { cellType: 'text' as const, data: '100%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1047' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Shared Core' },
      CorePercentage: { cellType: 'text' as const, data: '50%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1045' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '60%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1046' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Full Core' },
      CorePercentage: { cellType: 'text' as const, data: '100%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1047' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Shared Core' },
      CorePercentage: { cellType: 'text' as const, data: '50%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1045' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '60%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1046' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Full Core' },
      CorePercentage: { cellType: 'text' as const, data: '100%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1047' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Shared Core' },
      CorePercentage: { cellType: 'text' as const, data: '50%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1045' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Immediate Use' },
      CorePercentage: { cellType: 'text' as const, data: '60%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1046' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Full Core' },
      CorePercentage: { cellType: 'text' as const, data: '100%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
    {
      CoreId: { cellType: 'text' as const, data: '#1047' },
      Timeline: { cellType: 'text' as const, data: '28 May → 2 June' },
      Price: { cellType: 'text' as const, data: '42 DOT' },
      Deployment: { cellType: 'text' as const, data: 'Shared Core' },
      CorePercentage: { cellType: 'text' as const, data: '50%' },
      Action: {
        cellType: 'jsx' as const,
        data: (
          <div className={styles.actionCell}>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ),
      },
    },
  ];

  return (
    <div className={styles.secondaryMarketPage}>
      <div className={styles.secondaryMarketTableContainer}>
        <div className={styles.secondaryMarketTableInner}>
          <div className={styles.tableWrapper}>
            <h2 className={styles.marketHeading}>Secondary Marketplace Snapshot</h2>

            <TableComponent data={tableData} pageSize={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
