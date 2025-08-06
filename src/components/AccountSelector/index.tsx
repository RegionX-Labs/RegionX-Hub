'use client';

import { useState } from 'react';
import { useUnit } from 'effector-react';
import Identicon from '@polkadot/react-identicon';
import Image from 'next/image';
import styles from './account.module.scss';
import Select from '../elements/Select';
import WalletModal from '../WalletModal/WalletModal';

import {
  $loadedAccounts,
  $selectedAccount,
  accountSelected,
  SELECTED_WALLET_KEY,
  SELECTED_ACCOUNT_KEY,
  walletSelected,
} from '@/wallet';
import { $accountIdentities } from '@/account/accountIdentity';

const AccountSelector = () => {
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const accounts = useUnit($loadedAccounts);
  const selectedAccount = useUnit($selectedAccount);
  const identities = useUnit($accountIdentities);

  const handleChange = (value: string | null) => {
    if (value === 'disconnect') {
      localStorage.removeItem(SELECTED_WALLET_KEY);
      localStorage.removeItem(SELECTED_ACCOUNT_KEY);
      walletSelected('');
      accountSelected('');
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
    `${address.slice(0, 4)}...${address.slice(-6)}`;

  const accountOptions = accounts.map((account) => {
    const identity = identities[account.address];
    const hasIdentity = !!identity;
    const hasJudgement = identity?.hasJudgement ?? false;

    const label = `${identity?.name || account.name || 'Unknown'} (${formatAddress(account.address)})`;

    const icon = (
      <div className={styles.iconWrapper}>
        <Identicon
          value={account.address}
          size={24}
          theme='polkadot'
          className={styles.identicon}
        />
        {hasIdentity && hasJudgement && (
          <Image
            src='/verified.png'
            alt='Verified'
            width={100}
            height={100}
            className={styles.verifiedIcon}
          />
        )}
        {hasIdentity && !hasJudgement && (
          <Image
            src='/no-judgement.png'
            alt='No Judgment'
            width={100}
            height={100}
            className={styles.noJudgement}
          />
        )}
      </div>
    );

    return {
      key: account.address,
      value: account.address,
      label,
      icon,
    };
  });

  const connectWalletOption = {
    key: 'connect-another-wallet',
    value: 'connect-another-wallet',
    label: 'Connect Another Wallet',
    icon: <></>,
  };

  const disconnectOption = {
    key: 'disconnect',
    value: 'disconnect',
    label: 'Disconnect',
    icon: <></>,
  };

  const options = [...accountOptions, connectWalletOption, disconnectOption];

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
