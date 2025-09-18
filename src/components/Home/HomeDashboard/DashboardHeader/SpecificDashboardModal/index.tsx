'use client';

import { X, LayoutDashboard, Rocket, Wrench, Store } from 'lucide-react';
import styles from './SpecificDashboardModal.module.scss';

const dashboards = [
  {
    name: 'Overview',
    key: 'overview',
    description: 'High-level summary of all Coretime related activity.',
    enabled: true,
    icon: LayoutDashboard,
  },
  {
    name: 'Deploy new project',
    key: 'deploying-new-project',
    description: 'Purchase a new core for your project.',
    enabled: true,
    icon: Rocket,
  },
  {
    name: 'Manage existing project',
    key: 'managing-existing-project',
    description: 'Renew and manage existing parachain projects.',
    enabled: true,
    icon: Wrench,
  },
  {
    name: 'Coretime reselling',
    key: 'coretime-reseller',
    description: 'Secondary market features for trading coretime.',
    enabled: false,
    icon: Store,
  },
] as const;

type Props = {
  onSelect: (key: string) => void;
  onClose?: () => void;
};

export default function SpecificDashboardModal({ onSelect, onClose }: Props) {
  return (
    <div
      className={styles.modalOverlay}
      role='dialog'
      aria-modal='true'
      aria-labelledby='sdm-title'
    >
      <div className={styles.modalContent}>
        {onClose && (
          <button type='button' className={styles.closeButton} onClick={onClose} aria-label='Close'>
            <X size={18} />
          </button>
        )}

        <div className={styles.header}>
          {/* <div className={styles.headerIcon}>
            <Rocket size={18} />
          </div> */}
          <div>
            <div id='sdm-title' className={styles.title}>
              Choose your dashboard
            </div>
            <div className={styles.subtitle}>Jump straight into the workflow you need</div>
          </div>
        </div>

        <div className={styles.gridWrapper}>
          {dashboards.map(({ name, key, description, enabled, icon: Icon }) => (
            <button
              key={key}
              type='button'
              onClick={() => enabled && onSelect(key)}
              className={`${styles.dashboardButton} ${!enabled ? styles.disabled : ''}`}
              aria-disabled={!enabled}
              disabled={!enabled}
              aria-label={name}
            >
              <div className={styles.iconWrap}>
                <Icon size={22} />
              </div>
              <div className={styles.cardTitle}>{name}</div>
              <div className={styles.cardDesc}>{description}</div>
              {!enabled && <div className={styles.comingSoon}>Coming soon</div>}
            </button>
          ))}
        </div>

        <div className={styles.note}>You can change this view anytime from the dropdown.</div>
      </div>
    </div>
  );
}
