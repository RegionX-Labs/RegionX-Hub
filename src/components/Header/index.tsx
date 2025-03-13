import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './header.module.scss';
import AccountSelector from '@/components/AccountSelector';
import NetworkSelector from '@/components/NetworkSelector';
import WalletModal from '../WalletModal/WalletModal';
import CoretimeMenu from '../CoretimeMenu/index';
import { Button } from '@region-x/components';
import { $loadedAccounts } from '@/wallet';
import DownArrow from '../../../public/DownArrow.svg';

const Header: React.FC = () => {
  const accounts = useUnit($loadedAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoretimeMenuOpen, setIsCoretimeMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isModalOpen) {
      setIsMenuOpen(false);
    }
  }, [isModalOpen]);

  const handleNavigation = (path: string) => {
    router.push({
      pathname: path.startsWith("/") ? path : `/${path}`,
      query: router.query,
    });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCoretimeMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.burgerIcon} onClick={toggleMenu}>
        ☰
      </div>

      <Image
        src='/logo.png'
        alt='Logo'
        className={`${styles.logo} ${isMenuOpen ? styles.logoShifted : ''}`}
        width={1463}
        height={391}
      />

      <div className={styles.desktopLinks}>
        <ul className={styles.navList}>
          <li className={styles.navItem} onClick={() => handleNavigation('')}>
            Home
          </li>
          <CoretimeMenu />
          <li className={styles.navItem} onClick={() => handleNavigation('cross-chain')}>
            Cross-Chain
          </li>
          <li className={styles.navItem} onClick={() => handleNavigation('parachain-dashboard')}>
            Parachain Dashboard
          </li>
          <li className={styles.navItem} onClick={() => handleNavigation('secondary-market')}>
            Secondary Market
          </li>
        </ul>
      </div>

      <div className={styles.desktopContent}>
        <div className={styles.networkSelector} style={{ width: '150px' }}>
          <NetworkSelector />
        </div>
        {accounts.length > 0 ? (
          <div className={styles.accSelector}>
            <AccountSelector />
          </div>
        ) : (
          <Button onClick={() => setIsModalOpen(true)}>Connect Wallet</Button>
        )}
      </div>

      <div className={`${styles.slideMenu} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.navList}>
          <li className={styles.navItem} onClick={() => handleNavigation('')}>
            Home
          </li>
          <li className={styles.navItem} onClick={() => setIsCoretimeMenuOpen(!isCoretimeMenuOpen)}>
            Coretime
            <Image src={DownArrow} alt='Down Arrow' className={styles.downArrow} />
          </li>
          {isCoretimeMenuOpen && (
            <div className={styles.coretimeSubMenu}>
              <li className={styles.navItem} onClick={() => handleNavigation('coretime/my-regions')}>
                My Regions
              </li>
              <li className={styles.navItem} onClick={() => handleNavigation('coretime/renew')}>
                Renew
              </li>
              <li className={styles.navItem} onClick={() => handleNavigation('coretime/purchase')}>
                Purchase
              </li>
              <li
                className={styles.navItem}
                onClick={() => handleNavigation('coretime/sale-history')}
              >
                Sale History
              </li>
            </div>
          )}
          <li className={styles.navItem} onClick={() => handleNavigation('cross-chain')}>
            Cross-Chain
          </li>
          <li className={styles.navItem} onClick={() => handleNavigation('parachain-dashboard')}>
            Parachain Dashboard
          </li>
          <li className={styles.navItem} onClick={() => handleNavigation('secondary-market')}>
            Secondary Market
          </li>
        </ul>

        <div className={styles.mobileContent}>
          <div className={styles.networkSelector} style={{ width: '150px' }}>
            <NetworkSelector />
          </div>
          {accounts.length > 0 ? (
            <div className={styles.accSelector}>
              <AccountSelector />
            </div>
          ) : (
            <Button onClick={() => setIsModalOpen(true)}>Connect Wallet</Button>
          )}
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu} />}
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Header;
