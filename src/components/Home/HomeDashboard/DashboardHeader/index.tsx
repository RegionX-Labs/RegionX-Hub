'use client';

import { useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './DashboardHeader.module.scss';
import { ChevronDown } from 'lucide-react';
import { $selectedAccount } from '@/wallet';

const dashboards = [
  { name: 'Overview', enabled: true },
  { name: 'Deploying a new project', enabled: true },
  { name: 'Managing Existing Project', enabled: true },
  { name: 'Coretime Reseller', enabled: false },
];

type Props = {
  selected: string;
  setSelected: (value: string) => void;
};

export default function DashboardHeader({ selected, setSelected }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedAccount = useUnit($selectedAccount);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleSelect = (item: string, enabled: boolean) => {
    if (!enabled) return;
    setSelected(item);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.greetingBlock}>
        <div className={styles.greeting}>👋 Hi {selectedAccount?.name ?? 'there'}</div>
        <div className={styles.subtext}>Welcome back to RegionX Hub</div>
      </div>
      <div className={styles.dropdownWrapper}>
        <div className={styles.dropdownHeader} onClick={toggleDropdown}>
          {selected}
          <ChevronDown size={18} />
        </div>
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            {dashboards.map(({ name, enabled }) => (
              <div
                key={name}
                className={`${styles.dropdownItem} ${!enabled ? styles.disabled : ''}`}
                onClick={() => handleSelect(name, enabled)}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
