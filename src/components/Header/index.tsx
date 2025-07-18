import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './header.module.scss';
import AccountSelector from '@/components/AccountSelector';
import NetworkSelector from '@/components/NetworkSelector';
import WalletModal from '../WalletModal/WalletModal';
import { $loadedAccounts } from '@/wallet';
import DownArrow from '../../../public/DownArrow.svg';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  openRpcModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, openRpcModal }) => {
  const accounts = useUnit($loadedAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoretimeMenuOpen, setIsCoretimeMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isModalOpen) setIsMenuOpen(false);
  }, [isModalOpen]);

  const handleNavigation = (path: string) => {
    router.push({ pathname: path.startsWith('/') ? path : `/${path}`, query: router.query });
    setIsMenuOpen(false);
    setIsCoretimeMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsCoretimeMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarInner}>
          <div className={styles.leftSection}>
            <div className={styles.burgerIcon} onClick={toggleMenu}>
              ☰
            </div>
            <Image
              src={theme === 'dark' ? '/WhiteLogo.png' : '/DarkLogo.png'}
              alt='Logo'
              className={styles.logo}
              width={1229}
              height={782}
              onClick={() => handleNavigation('/')}
              priority
            />
          </div>

          <div
            className={`${styles.desktopLinks} ${accounts.length === 0 ? styles.desktopLinksWithConnect : ''}`}
          >
            <ul className={styles.navList}>
              <li className={styles.navItem} onClick={() => handleNavigation('')}>
                Home
              </li>
              <li
                className={styles.navItem}
                onClick={() => setIsCoretimeMenuOpen(!isCoretimeMenuOpen)}
              >
                Coretime <Image src={DownArrow} alt='Down Arrow' className={styles.downArrow} />
              </li>
              {isCoretimeMenuOpen && (
                <ul className={styles.coretimeSubMenuDesktop}>
                  <li
                    className={styles.navItem}
                    onClick={() => handleNavigation('coretime/my-regions')}
                  >
                    My Regions
                  </li>
                  <li
                    className={styles.navItem}
                    onClick={() => handleNavigation('coretime/sale-history')}
                  >
                    Sale History
                  </li>
                </ul>
              )}
              <li className={styles.navItem} onClick={() => handleNavigation('cross-chain')}>
                Cross-Chain
              </li>
              <li
                className={styles.navItem}
                onClick={() => handleNavigation('parachain-dashboard')}
              >
                Parachain Dashboard
              </li>
              <li className={styles.navItem} onClick={() => handleNavigation('secondary-market')}>
                Secondary Market
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.desktopContent}>
          <div className={styles.networkSelector}>
            <NetworkSelector />
          </div>
          {accounts.length > 0 ? (
            <div className={styles.accSelector}>
              <AccountSelector />
            </div>
          ) : (
            <button className={styles.connectButton} onClick={() => setIsModalOpen(true)}>
              Connect Wallet
            </button>
          )}
          <div className={styles.rpcButtonDesktop}></div>
        </div>
      </nav>

      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div className={`${styles.slideMenu} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.navList}>
          <li className={styles.navItem} onClick={() => handleNavigation('')}>
            Home
          </li>
          <li className={styles.navItem} onClick={() => setIsCoretimeMenuOpen(!isCoretimeMenuOpen)}>
            Coretime <Image src={DownArrow} alt='Down Arrow' className={styles.downArrow} />
          </li>
          {isCoretimeMenuOpen && (
            <ul className={styles.coretimeSubMenu}>
              <li
                className={styles.navItem}
                onClick={() => handleNavigation('coretime/my-regions')}
              >
                My Regions
              </li>
              <li
                className={styles.navItem}
                onClick={() => handleNavigation('coretime/sale-history')}
              >
                Sale History
              </li>
            </ul>
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
          <div className={styles.networkSelector}>
            <NetworkSelector />
          </div>
          {accounts.length > 0 ? (
            <div className={styles.accSelector}>
              <AccountSelector />
            </div>
          ) : (
            <button className={styles.connectButton} onClick={() => setIsModalOpen(true)}>
              Connect Wallet
            </button>
          )}
        </div>

        <div className={styles.mobileRpcButton}>
          <div className={styles.mobileRpcInner}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title='Toggle Theme'
            >
              <Image
                src={theme === 'dark' ? '/LightMode.svg' : '/DarkMode.svg'}
                alt='Toggle Theme'
                width={20}
                height={20}
              />
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                openRpcModal();
              }}
              title='RPC Settings'
            >
              <Image src='/Settings.svg' alt='RPC Settings' width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
