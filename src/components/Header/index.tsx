import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './header.module.scss';
import AccountSelector from '@/components/AccountSelector';
import NetworkSelector from '@/components/NetworkSelector';
import WalletModal from '../WalletModal/WalletModal';
import CoretimeMenu from '../CoretimeMenu';
import RpcSettingsModal from '@/components/RpcSettingsModal';
import { Button } from '@region-x/components';
import { $loadedAccounts } from '@/wallet';
import DownArrow from '../../../public/DownArrow.svg';

const Header: React.FC = () => {
  const accounts = useUnit($loadedAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRpcModalOpen, setIsRpcModalOpen] = useState(false);
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
      pathname: path.startsWith('/') ? path : `/${path}`,
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
      <div className={styles.navbarInner}>
        <div className={styles.burgerIcon} onClick={toggleMenu}>
          ☰
        </div>

        <div className={styles.leftSection}>
          <Image
            src='/WhiteLogo.png'
            alt='Logo'
            className={styles.logo}
            width={1829}
            height={782}
            onClick={() => handleNavigation('/')}
          />
        </div>

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
          <Button
            onClick={() => {
              setIsRpcModalOpen(true);
              setIsMenuOpen(false);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              RPC
              <Image src='/settingIcon.PNG' alt='settings' width={20} height={20} />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu, Modals, and Overlays (no changes) */}
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
              <li
                className={styles.navItem}
                onClick={() => handleNavigation('coretime/my-regions')}
              >
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
          <Button
            onClick={() => {
              setIsRpcModalOpen(true);
              setIsMenuOpen(false);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              RPC
              <Image src='/settingIcon.PNG' alt='settings' width={20} height={20} />
            </div>
          </Button>
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu} />}
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <RpcSettingsModal
        isOpen={isRpcModalOpen}
        onClose={() => setIsRpcModalOpen(false)}
        onRpcChange={(url) => {
          console.log('RPC changed to:', url);
        }}
      />
    </nav>
  );
};

export default Header;
