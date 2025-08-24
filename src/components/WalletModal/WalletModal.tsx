'use client';

import React from 'react';
import { useUnit } from 'effector-react';
import { $walletExtensions, $connectedWallets, walletAdded } from '@/wallet';
import Image from 'next/image';
import styles from './walletModal.module.scss';
import { polkadotIcon, subwalletIcon, talismanIcon, novaIcon, mimirIcon } from '@/assets/wallets';
import { Download, ExternalLink } from 'lucide-react';

const isMobile =
  typeof navigator !== 'undefined' && /android|iphone|ipad|mobile/i.test(navigator.userAgent);

const STANDARD_WALLETS = [
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

const MULTISIG_WALLETS = [
  {
    name: 'Mimir',
    id: 'mimir',
    icon: mimirIcon,
    url: 'https://mimir.global/',
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const availableWallets = useUnit($walletExtensions);
  const connectedWallets = useUnit($connectedWallets);

  const hasSubWallet = availableWallets.some((w) => w.name === 'subwallet-js');

  if (!isOpen) return null;

  const handleWalletClick = (walletId: string, isAvailable: boolean, alreadyConnected: boolean) => {
    if (isAvailable && !alreadyConnected) {
      walletAdded(walletId);
      onClose();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const renderWalletButton = (wallet: any) => {
    const isDetected = availableWallets.some((w) => w.name === wallet.id);
    const alreadyConnected = connectedWallets.includes(wallet.id);
    const mimirAvailable = wallet.id === 'mimir' && window !== window.parent;
    const shouldDisable =
      alreadyConnected ||
      !isDetected ||
      (wallet.id === 'nova' && isMobile && hasSubWallet) ||
      mimirAvailable;

    const buttonClass = `${styles.walletButton} ${shouldDisable ? styles.disabled : ''}`;

    return (
      <button
        key={wallet.id}
        className={buttonClass}
        onClick={() => handleWalletClick(wallet.id, isDetected, alreadyConnected)}
      >
        <div className={styles.walletIconWrapper}>
          <Image
            src={wallet.icon.src}
            alt={wallet.name}
            className={styles.walletIcon}
            width={36}
            height={36}
          />
        </div>
        <div className={styles.walletTextWrapper}>
          <span className={styles.walletName}>{wallet.name}</span>
          {alreadyConnected && <span className={styles.connectedLabel}>Connected</span>}
          {!isDetected && (
            <a
              href={wallet.url}
              target='_blank'
              rel='noopener noreferrer'
              onClick={(e) => e.stopPropagation()}
            >
              {wallet.id === 'mimir' ? (
                <ExternalLink size={18} className={styles.downloadIcon} />
              ) : (
                <Download size={18} className={styles.downloadIcon} />
              )}
            </a>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.desktopOnly}>Connect Wallet</h2>

        <div className={styles.walletContainer}>
          {STANDARD_WALLETS.filter((wallet) => {
            if (wallet.id === 'polkadot-js' && isMobile) return false;
            return true;
          }).map(renderWalletButton)}
        </div>

        <hr className={styles.divider} />

        <h3 className={styles.subHeader}>Multisig Wallets</h3>
        <div className={styles.walletContainer}>{MULTISIG_WALLETS.map(renderWalletButton)}</div>

        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
