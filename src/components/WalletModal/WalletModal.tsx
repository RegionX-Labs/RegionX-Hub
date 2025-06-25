'use client';

import React from 'react';
import { useUnit } from 'effector-react';
import { $walletExtensions, walletSelected, SELECTED_WALLET_KEY } from '@/wallet';
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
    name: 'Nova Wallet',
    id: 'nova',
    icon: novaIcon,
    url: 'https://novawallet.io/',
  },
];

const isNovaMobile = () =>
  typeof navigator !== 'undefined' && /NovaWallet/i.test(navigator.userAgent);

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const availableWallets = useUnit($walletExtensions);

  if (!isOpen) return null;

  const isAvailable = (walletId: string): boolean => {
    if (walletId === 'nova' && isNovaMobile()) return true;
    return availableWallets.some((w) => w.name === walletId);
  };

  const handleWalletClick = (walletId: string, available: boolean) => {
    if (!available) return;

    walletSelected(walletId);
    localStorage.setItem(SELECTED_WALLET_KEY, walletId);
    onClose();
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
            const available = isAvailable(wallet.id);
            const buttonClass = `${styles.walletButton} ${!available ? styles.disabled : ''}`;

            return (
              <button
                key={wallet.id}
                className={buttonClass}
                onClick={() => handleWalletClick(wallet.id, available)}
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
                  {!available && (
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
