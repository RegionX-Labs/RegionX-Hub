import styles from './dashboard.module.scss';
import { TableComponent } from '@region-x/components';

const ParachainDashboard = () => {
  const tableData: Record<
    string,
    { cellType: 'text' | 'link' | 'address' | 'jsx'; data: string }
  >[] = [
    {
      Name: { cellType: 'text', data: 'Acala' },
      Id: { cellType: 'text', data: '1000' },
      State: { cellType: 'text', data: 'Active' },
      Expiry: { cellType: 'text', data: '2025-06-01' },
      Watchlist: { cellType: 'text', data: 'Yes' },
    },
    {
      Name: { cellType: 'text', data: 'Moonbeam' },
      Id: { cellType: 'text', data: '1001' },
      State: { cellType: 'text', data: 'Active' },
      Expiry: { cellType: 'text', data: '2025-09-12' },
      Watchlist: { cellType: 'text', data: 'No' },
    },
    {
      Name: { cellType: 'text', data: 'Parallel' },
      Id: { cellType: 'text', data: '1002' },
      State: { cellType: 'text', data: 'Inactive' },
      Expiry: { cellType: 'text', data: '2024-12-30' },
      Watchlist: { cellType: 'text', data: 'Yes' },
    },
    {
      Name: { cellType: 'text', data: 'Astar' },
      Id: { cellType: 'text', data: '1003' },
      State: { cellType: 'text', data: 'Active' },
      Expiry: { cellType: 'text', data: '2026-03-15' },
      Watchlist: { cellType: 'text', data: 'No' },
    },
    {
      Name: { cellType: 'text', data: 'Phala' },
      Id: { cellType: 'text', data: '10004' },
      State: { cellType: 'text', data: 'Active' },
      Expiry: { cellType: 'text', data: '2025-11-10' },
      Watchlist: { cellType: 'text', data: 'Yes' },
    },
  ];

  return (
    <>
      <div className={styles.buttonContainer}>
        <button className={styles.customButton}>Watchlist Only</button>
        <button className={`${styles.customButton} ${styles.secondary}`}>Reserve New Para</button>
      </div>
      <div className={styles.dashboard_table}>
        <TableComponent data={tableData} pageSize={5} />
      </div>
    </>
  );
};

export default ParachainDashboard;
