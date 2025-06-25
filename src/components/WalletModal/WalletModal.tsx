import React, { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $walletExtensions, SELECTED_WALLET_KEY, walletSelected } from '@/wallet';
import Image from 'next/image';
import styles from './walletModal.module.scss';
import { polkadotIcon, subwalletIcon, talismanIcon, novaIcon } from '@/assets/wallets';
import { Download } from 'lucide-react';

const WALLET_OPTIONS = [
  {
    name: 'Polkadot{.js}',
    id: 'polkadot-js',
    icon: polkadotIcon,
    url: 'https://polkadot.js.org/extension/',
  },
  {
    name: 'Talisman',
    id: 'talisman',
    icon: talismanIcon,
    url: 'https://www.talisman.xyz/',
  },
  {
    name: 'SubWallet',
    id: 'subwallet-js',
    icon: subwalletIcon,
    url: 'https://subwallet.app/',
  },
  {
    name: 'Nova',
    id: 'nova',
    icon: novaIcon,
    url: 'https://novawallet.io/',
  },
];

function isNovaWallet() {
  return typeof window !== 'undefined' && /NovaWallet/i.test(navigator.userAgent);
}

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const availableWallets = useUnit($walletExtensions);
  const [isMobileView, setIsMobileView] = useState(false);
  const [walletsToShow, setWalletsToShow] = useState(WALLET_OPTIONS);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const hasPolkadotJs = availableWallets.some((w) => w.name === 'polkadot-js');
    const hasNova = availableWallets.some((w) => w.name === 'nova');
    const inNova = isNovaWallet();

    let filtered = WALLET_OPTIONS;

    if (inNova) {
      filtered = WALLET_OPTIONS.filter((w) => w.id === 'nova');
    } else if (isMobileView && hasPolkadotJs) {
      filtered = WALLET_OPTIONS.filter((w) => w.id !== 'polkadot-js');
    }

    setWalletsToShow(filtered);
  }, [availableWallets, isMobileView]);

  if (!isOpen) return null;

  const handleWalletClick = (walletId: string, isAvailable: boolean) => {
    if (isAvailable) {
      walletSelected(walletId);
      localStorage.setItem(SELECTED_WALLET_KEY, walletId);
      onClose();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.desktopOnly}>Connect Wallet</h2>
        <div className={styles.walletContainer}>
          {walletsToShow.map((wallet) => {
            const isAvailable = availableWallets.some((w) => w.name === wallet.id);
            const buttonClass = `${styles.walletButton} ${!isAvailable ? styles.disabled : ''}`;

            return (
              <button
                key={wallet.id}
                className={buttonClass}
                onClick={() => handleWalletClick(wallet.id, isAvailable)}
              >
                <div className={styles.walletIconWrapper}>
                  <Image
                    src={wallet.icon.src}
                    alt={wallet.name}
                    className={styles.walletIcon}
                    width={24}
                    height={24}
                  />
                </div>

                <div className={styles.walletTextWrapper}>
                  <span className={styles.walletName}>{wallet.name}</span>
                  {!isAvailable && (
                    <a
                      href={wallet.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download size={18} className={styles.downloadIcon} />
                    </a>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
