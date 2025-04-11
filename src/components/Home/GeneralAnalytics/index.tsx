import styles from './GeneralAnalytics.module.scss';

export default function GeneralAnalytics() {
  return (
    <div className={styles.analyticsCard}>
      <div className={styles.header}>
        <h2>General Analytics</h2>
        <p>Control all the metrics in this section</p>
      </div>
      <div className={styles.tabsWrapper}>
        <ul className={styles.tabs}>
          <li className={`${styles.tab} ${styles.active}`}>All stats</li>
          <li className={styles.tab}>Sales</li>
          <li className={styles.tab}>Users</li>
          <li className={styles.tab}>Market</li>
        </ul>
      </div>

      <div className={styles.metricBox}>
        <p className={styles.metricLabel}>Total Cores Sold</p>
        <h3 className={styles.coretimeValue}>124,420</h3>
        <p className={styles.gain}>
          Revenue compared to last month <span className={styles.gainAmount}>+$420.00</span>
        </p>
        <div className={styles.splitCards}>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Bulk</p>
            <div className={styles.splitDetails}>
              <span>$29,340.20</span>
              <span className={styles.positive}>+3.4%</span>
            </div>
          </div>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Resale</p>
            <div className={styles.splitDetails}>
              <span>$95,080.30</span>
              <span className={styles.negative}>-0.1%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.metricBox}>
        <p className={styles.metricLabel}>Total Cores Sold</p>
        <h3 className={styles.coretimeValue}>124,420</h3>
        <p className={styles.gain}>
          Revenue compared to last month <span className={styles.gainAmount}>+$420.00</span>
        </p>
        <div className={styles.splitCards}>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Bulk</p>
            <div className={styles.splitDetails}>
              <span>$29,340.20</span>
              <span className={styles.positive}>+3.4%</span>
            </div>
          </div>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Resale</p>
            <div className={styles.splitDetails}>
              <span>$95,080.30</span>
              <span className={styles.negative}>-0.1%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.metricBox}>
        <p className={styles.metricLabel}>Total Cores Sold</p>
        <h3 className={styles.coretimeValue}>124,420</h3>
        <p className={styles.gain}>
          Revenue compared to last month <span className={styles.gainAmount}>+$420.00</span>
        </p>
        <div className={styles.splitCards}>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Bulk</p>
            <div className={styles.splitDetails}>
              <span>$29,340.20</span>
              <span className={styles.positive}>+3.4%</span>
            </div>
          </div>
          <div className={styles.splitCard}>
            <p className={styles.splitLabel}>Resale</p>
            <div className={styles.splitDetails}>
              <span>$95,080.30</span>
              <span className={styles.negative}>-0.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
