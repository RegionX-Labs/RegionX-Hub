import React from 'react';
import { useUnit } from 'effector-react';
import { $walletExtensions, SELECTED_WALLET_KEY, walletSelected } from '@/wallet';
import Image from 'next/image';
import styles from './walletModal.module.scss';
import { polkadotIcon, subwalletIcon, talismanIcon, novaIcon } from '@/assets/wallets';

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
    id: 'subwallet',
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

  if (!isOpen) return null;

  const handleWalletClick = (walletId: string, isAvailable: boolean, url: string) => {
    if (isAvailable) {
      walletSelected(walletId);
      localStorage.setItem(SELECTED_WALLET_KEY, walletId);
      onClose();
    } else {
      const confirmed = window.confirm(
        'This wallet extension is not installed.\nDo you want to visit the official website to install it?'
      );
      if (confirmed) {
        window.open(url, '_blank');
      }
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
          {WALLET_OPTIONS.map((wallet) => {
            const isAvailable = availableWallets.some((w) => w.name === wallet.id);
            const disabledClass = !isAvailable ? styles.disabled : '';

            return (
              <button
                key={wallet.id}
                className={`${styles.walletButton} ${disabledClass}`}
                onClick={() => handleWalletClick(wallet.id, isAvailable, wallet.url)}
              >
                <div className={styles.iconWrapper}>
                  <Image
                    src={wallet.icon.src}
                    alt={wallet.name}
                    className={styles.walletIcon}
                    width={24}
                    height={24}
                  />
                </div>
                <div className={styles.walletTextWrapper}>
                  <span className={styles.desktopOnly}>{wallet.name}</span>
                  {!isAvailable && (
                    <span className={`${styles.hideOnMobile} ${styles.extensionNote}`}>
                      Extension not found
                    </span>
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
