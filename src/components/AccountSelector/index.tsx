'use client';

import { useState } from 'react';
import { useUnit } from 'effector-react';
import Identicon from '@polkadot/react-identicon';
import Image from 'next/image';
import styles from './account.module.scss';
import Select from '../elements/Select';
import WalletModal from '../WalletModal/WalletModal';
import { $accountIdentities } from '@/account/accountIdentity';
import { $loadedAccounts, $selectedAccount, accountSelected, disconnectWallets } from '@/wallet';
import { encodeAddress } from '@polkadot/util-crypto';

import { polkadotIcon, subwalletIcon, talismanIcon, novaIcon } from '@/assets/wallets';
import { getNetworkSS58Prefix } from '@/utils';
import { $network } from '@/api/connection';

const WALLET_ICONS: Record<string, string> = {
  'polkadot-js': polkadotIcon.src,
  'subwallet-js': subwalletIcon.src,
  talisman: talismanIcon.src,
  nova: novaIcon.src,
};

const AccountSelector = () => {
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const network = useUnit($network);
  const accounts = useUnit($loadedAccounts);
  const selectedAccount = useUnit($selectedAccount);
  const identities = useUnit($accountIdentities);

  const handleChange = (value: string | null) => {
    if (value === 'disconnect') {
      disconnectWallets();
      return;
    }

    if (value === 'connect-another-wallet') {
      setWalletModalOpen(true);
      return;
    }

    if (value) {
      accountSelected(value);
    }
  };

  const formatAddress = (address: string): string =>
    `${address.slice(0, 3)}...${address.slice(-3)}`;

  const options = accounts.map((account) => {
    const identity = identities[account.address];
    const hasIdentity = !!identity;
    const hasJudgement = identity?.hasJudgement ?? false;

    const walletIconSrc = WALLET_ICONS[account.walletSource] || polkadotIcon.src;

    const icon = (
      <div className={styles.inlineWrapper}>
        <Identicon
          value={encodeAddress(account.address, getNetworkSS58Prefix(network))}
          size={24}
          theme='polkadot'
          className={styles.identicon}
        />

        {hasIdentity && hasJudgement && (
          <Image
            src='/verified.png'
            alt='Verified'
            width={24}
            height={24}
            className={styles.checkmark}
          />
        )}
        {hasIdentity && !hasJudgement && (
          <Image
            src='/no-judgement.png'
            alt='No Judgment'
            width={24}
            height={24}
            className={styles.judgement}
          />
        )}

        <span className={styles.accountName}>{identity?.name || account.name || 'Unknown'}</span>

        <span className={styles.addressLine}>
          {formatAddress(encodeAddress(account.address, getNetworkSS58Prefix(network)))}
        </span>

        <Image
          src={walletIconSrc}
          alt={account.walletSource}
          width={18}
          height={18}
          className={styles.walletLogo}
        />
      </div>
    );

    return {
      key: account.address,
      value: account.address,
      label: '',
      icon,
    };
  });

  options.push({
    key: 'connect-another-wallet',
    value: 'connect-another-wallet',
    label: 'Connect Multiple Wallets',
    icon: <></>,
  });

  if (accounts.length > 0) {
    options.push({
      key: 'disconnect',
      value: 'disconnect',
      label: 'Disconnect',
      icon: <></>,
    });
  }

  return (
    <div className={styles.selectWrapper}>
      <Select
        options={options}
        onChange={handleChange}
        placeholder='Select an account'
        selectedValue={selectedAccount?.address ?? null}
      />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </div>
  );
};

export default AccountSelector;
