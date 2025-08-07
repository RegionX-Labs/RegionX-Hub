import React, { useState } from 'react';
import { useUnit } from 'effector-react';
import { $walletExtensions, walletSelected, SELECTED_WALLET_KEY } from '@/wallet';
import Image from 'next/image';
import styles from './walletModal.module.scss';
import { polkadotIcon, subwalletIcon, talismanIcon, novaIcon } from '@/assets/wallets';
import { Download } from 'lucide-react';

const isMobile =
  typeof navigator !== 'undefined' && /android|iphone|ipad|mobile/i.test(navigator.userAgent);

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

interface MultiWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MultiWalletModal: React.FC<MultiWalletModalProps> = ({ isOpen, onClose }) => {
  const availableWallets = useUnit($walletExtensions);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);

  const hasSubWallet = availableWallets.some((w) => w.name === 'subwallet-js');

  if (!isOpen) return null;

  const toggleWallet = (walletId: string) => {
    setSelectedWallets((prev) =>
      prev.includes(walletId) ? prev.filter((id) => id !== walletId) : [...prev, walletId]
    );
  };

  const handleConfirm = () => {
    selectedWallets.forEach((walletId) => {
      walletSelected(walletId);
    });
    if (selectedWallets.length > 0) {
      localStorage.setItem(SELECTED_WALLET_KEY, selectedWallets[selectedWallets.length - 1]);
    }
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
        <h2 className={styles.desktopOnly}>Connect Wallets</h2>
        <div className={styles.walletContainer}>
          {WALLET_OPTIONS.filter((wallet) => {
            if (wallet.id === 'polkadot-js' && isMobile) return false;
            return true;
          }).map((wallet) => {
            const isDetected = availableWallets.some((w) => w.name === wallet.id);
            const shouldDisable = !isDetected || (wallet.id === 'nova' && isMobile && hasSubWallet);
            const isSelected = selectedWallets.includes(wallet.id);

            const buttonClass = `
              ${styles.walletButton}
              ${shouldDisable ? styles.disabled : ''}
              ${isSelected ? styles.selected : ''}
            `;

            return (
              <button
                key={wallet.id}
                className={buttonClass}
                onClick={() => {
                  if (!shouldDisable) toggleWallet(wallet.id);
                }}
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
                  {!isDetected && (
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

        <button
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={selectedWallets.length === 0}
        >
          Confirm ({selectedWallets.length})
        </button>

        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default MultiWalletModal;
