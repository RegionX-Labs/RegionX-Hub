'use client';

import { useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './DashboardHeader.module.scss';
import { ChevronDown } from 'lucide-react';
import { $selectedAccount } from '@/wallet';

const dashboards = ['Existing teams', 'New teams', 'Coretime Reseller', 'Enthusiast'];

export default function DashboardHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState('Existing teams');

  const selectedAccount = useUnit($selectedAccount);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleSelect = (item: string) => {
    setSelected(item);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.greetingBlock}>
        <div className={styles.greeting}>👋 Hi {selectedAccount?.name ?? 'there'}</div>
        <div className={styles.subtext}>Welcome back to your Coretime Hub</div>
      </div>
      <div className={styles.dropdownWrapper}>
        <div className={styles.dropdownHeader} onClick={toggleDropdown}>
          {selected}
          <ChevronDown size={18} />
        </div>
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            {dashboards.map((item) => (
              <div key={item} className={styles.dropdownItem} onClick={() => handleSelect(item)}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
