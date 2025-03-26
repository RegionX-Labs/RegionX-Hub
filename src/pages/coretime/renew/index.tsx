import { Select, Button } from '@region-x/components';
import styles from './renew.module.scss';

const RenewPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.selectWrapper}>
          <Select
            options={[
              { value: 'acala', label: 'Acala #2000 | Core 50' },
              { value: 'none', label: 'No need to renew in the current sale' },
            ]}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span>Core number:</span>
            <span>80</span>
          </div>
          <div className={styles.detailRow}>
            <span>Expiry in:</span>
            <span>6 weeks, 2 days, 12 hours</span>
          </div>
          <div className={styles.detailRow}>
            <span>Renewal price:</span>
            <span>0.990 DOT</span>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <div className={styles.buttonWrapper}>
            <Button>Renew</Button>
          </div>
          <div className={styles.coretimeText}>
            Polkadot Coretime: <span className={styles.amount}>0 DOT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewPage;
