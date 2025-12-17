import { ExternalLink } from 'lucide-react';
import styles from './ActivityDrawer.module.scss';
import { TxItem } from './useActivityData';
import { StatusIcon, StatusPill } from './StatusIcons';

type Props = {
  tx: TxItem;
};

export const ActivityItem = ({ tx }: Props) => {
  return (
    <li className={styles.item}>
      <div className={styles.itemTop}>
        <div className={styles.left}>
          <div className={`${styles.icon} ${styles[tx.status]}`}>
            <StatusIcon status={tx.status} />
          </div>
          <div className={styles.meta}>
            <div className={styles.row1}>
              <span className={styles.type} title={tx.type}>
                {tx.type}
              </span>
              <StatusPill status={tx.status} />
            </div>
            <div className={styles.row2}>
              <span className={styles.amount}>{tx.amount}</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.network}>{tx.network}</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.when}>{tx.when}</span>
            </div>
          </div>
        </div>
        <button
          className={styles.hashBtn}
          title='Open in explorer'
          disabled={!tx.link}
          onClick={() => tx.link && window.open(tx.link, '_blank')}
        >
          <span>{tx.hash}</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </li>
  );
};
