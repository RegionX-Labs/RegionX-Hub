import React from 'react';
import { useUnit } from 'effector-react';
import { $walletExtensions, walletSelected } from '@/wallet';
import Image from 'next/image';
import styles from './walletModal.module.scss';
import { polkadotIcon, subwalletIcon, talismanIcon, novaIcon } from '@/assets/networks/relay';

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
  { name: 'Nova', id: 'nova', icon: novaIcon, url: 'https://novawallet.io/' },
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
      onClose();
    } else {
      window.open(url, '_blank');
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
        <h2>Connect Wallet</h2>
        {WALLET_OPTIONS.map((wallet) => {
          const isAvailable = availableWallets.some((w) => w.name === wallet.id);

          return (
            <button
              key={wallet.id}
              className={`${styles.walletButton} ${!isAvailable ? styles.disabled : ''}`}
              onClick={() => handleWalletClick(wallet.id, isAvailable, wallet.url)}
            >
              <Image
                src={wallet.icon.src}
                alt={wallet.name}
                className={styles.walletIcon}
                width={24}
                height={24}
              />
              {wallet.name}
            </button>
          );
        })}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
