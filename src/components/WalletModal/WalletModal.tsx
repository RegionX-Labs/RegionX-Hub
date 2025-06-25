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

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const availableWallets = useUnit($walletExtensions);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const filteredWallets = WALLET_OPTIONS.filter((wallet) =>
    isMobile ? wallet.id !== 'polkadot-js' : true
  );

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.desktopOnly}>Connect Wallet</h2>
        <div className={styles.walletContainer}>
          {filteredWallets.map((wallet) => {
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
