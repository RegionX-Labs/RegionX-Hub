'use client';

import { useState, useMemo } from 'react';
import { useUnit } from 'effector-react';
import styles from './DashboardHeader.module.scss';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { $accountIdentities } from '@/account/accountIdentity';
import { $regions } from '@/coretime/regions';
import { $selectedAccount } from '@/wallet';
import HelpCenterModal from './HelpCenterModal';
import OwnedRegionsModal from './OwnedRegionsModal';
import { encodeAddress } from '@polkadot/util-crypto';
import NextPhaseTimer from './NextPhaseTimer';

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [regionsModalOpen, setRegionsModalOpen] = useState(false);
  const [selectedAccount, identities, allRegions] = useUnit([
    $selectedAccount,
    $accountIdentities,
    $regions,
  ]);

  const displayName =
    identities[selectedAccount?.address ?? '']?.name || selectedAccount?.name || 'there';

  const userHasRegions = useMemo(() => {
    if (!selectedAccount) return false;
    return allRegions.some(
      (region) => encodeAddress(region.owner, 42) === encodeAddress(selectedAccount.address, 42)
    );
  }, [allRegions, selectedAccount]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelect = (item: string, enabled: boolean) => {
    if (!enabled) return;
    setSelected(item);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.greetingBlock}>
        <div className={styles.greeting}>👋 Hi {displayName}</div>
        <div className={styles.subtext}>Welcome back to RegionX Hub</div>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button className={styles.helpButton} onClick={() => setIsHelpOpen(true)}>
          <HelpCircle size={18} />
          <span className={styles.buttonText} style={{ marginLeft: 6 }}>
            Help Center
          </span>
        </button>

        {userHasRegions && (
          <button className={styles.orangeAssignBtn} onClick={() => setRegionsModalOpen(true)}>
            Assign Region
          </button>
        )}
        <div className={styles.timerBadge}>
          <NextPhaseTimer />
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

      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        selected={selected}
      />

      <OwnedRegionsModal isOpen={regionsModalOpen} onClose={() => setRegionsModalOpen(false)} />
    </div>
  );
}
