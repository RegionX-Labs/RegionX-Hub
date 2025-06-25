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
  { name: 'Talisman', id: 'talisman', icon: talismanIcon, url: 'https://www.talisman.xyz/' },
  { name: 'SubWallet', id: 'subwallet-js', icon: subwalletIcon, url: 'https://subwallet.app/' },
  { name: 'Nova Wallet', id: 'nova', icon: novaIcon, url: 'https://novawallet.io/' },
];

const isNovaMobile = () =>
  typeof navigator !== 'undefined' && /NovaWallet/i.test(navigator.userAgent);

const getAdjustedWalletOptions = () => {
  return WALLET_OPTIONS.map((wallet) => {
    if (wallet.id === 'polkadot-js' && isNovaMobile()) {
      return {
        ...wallet,
        name: 'Nova Wallet',
        icon: novaIcon,
        id: 'nova',
        realId: 'polkadot-js',
      };
    }
    return {
      ...wallet,
      realId: wallet.id,
    };
  });
};

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const availableWallets = useUnit($walletExtensions);
  const walletsToShow = getAdjustedWalletOptions();

  if (!isOpen) return null;

  const isAvailable = (wallet: { id: string; realId: string }) => {
    if (wallet.id === 'nova' && isNovaMobile()) return true;
    return availableWallets.some((w) => w.name === wallet.realId);
  };

  const handleWalletClick = (displayId: string, realId: string, available: boolean) => {
    if (!available) return;
    walletSelected(displayId); // store 'nova' or actual extension
    localStorage.setItem(SELECTED_WALLET_KEY, displayId);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.desktopOnly}>Connect Wallet</h2>
        <div className={styles.walletContainer}>
          {walletsToShow.map((wallet) => {
            const available = isAvailable(wallet);
            const buttonClass = `${styles.walletButton} ${!available ? styles.disabled : ''}`;

            return (
              <button
                key={wallet.id}
                className={buttonClass}
                onClick={() => handleWalletClick(wallet.id, wallet.realId, available)}
              >
                <div className={styles.walletIconWrapper}>
                  <Image
                    src={wallet.icon.src}
                    alt={wallet.name}
                    width={24}
                    height={24}
                    className={styles.walletIcon}
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
