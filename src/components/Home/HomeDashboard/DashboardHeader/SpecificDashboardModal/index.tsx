'use client';

import { X } from 'lucide-react';
import styles from './SpecificDashboardModal.module.scss';

const dashboards = [
  {
    name: 'Overview',
    key: 'overview',
    description: 'Analytics, charts, and project summary.',
    enabled: true,
  },
  {
    name: 'Deploy new project',
    key: 'deploying-new-project',
    description: 'Purchase and configure new cores.',
    enabled: true,
  },
  {
    name: 'Manage Existing one',
    key: 'managing-existing-project',
    description: 'Renew and manage existing parachain projects.',
    enabled: true,
  },
  {
    name: 'Coretime reselling',
    key: 'coretime-reseller',
    description: 'This feature is not available.',
    enabled: false,
  },
];

type Props = {
  onSelect: (key: string) => void;
  onClose?: () => void;
};

export default function SpecificDashboardModal({ onSelect, onClose }: Props) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        )}

        <h2>🚀 What are you here for?</h2>

        <div className={styles.gridWrapper}>
          {dashboards.map(({ name, key, description, enabled }) => (
            <button
              key={key}
              onClick={() => enabled && onSelect(key)}
              className={`${styles.dashboardButton} ${!enabled ? styles.disabled : ''}`}
              disabled={!enabled}
            >
              <span className={styles.title}>{name}</span>
              <span className={styles.description}>{description}</span>
              {!enabled && <div className={styles.comingSoon}>Coming soon</div>}
            </button>
          ))}
        </div>

        <div className={styles.note}>You can change this view anytime from the dropdown.</div>
      </div>
    </div>
  );
}
