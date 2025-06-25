import { useUnit } from 'effector-react';
import Identicon from '@polkadot/react-identicon';
import styles from './account.module.scss';
import Select from '../elements/Select';
import { $loadedAccounts, $selectedAccount, accountSelected, disconnectWallet } from '@/wallet';

const AccountSelector = () => {
  const accounts = useUnit($loadedAccounts);
  const selectedAccount = useUnit($selectedAccount);

  const handleChange = (value: string | null) => {
    if (value === 'disconnect') {
      disconnectWallet();
      return;
    }
    if (value) {
      accountSelected(value);
    }
  };

  const formatAddress = (address: string): string =>
    `${address.slice(0, 4)}...${address.slice(-6)}`;

  const options = accounts.map((account) => ({
    key: account.address,
    value: account.address,
    label: `${account.name ?? 'Unknown'} (${formatAddress(account.address)})`,
    icon: (
      <div className={styles.icon}>
        <Identicon value={account.address} size={24} theme='polkadot' />
      </div>
    ),
  }));

  options.push({
    key: 'disconnect',
    value: 'disconnect',
    label: 'Disconnect',
    icon: <></>,
  });

  return (
    <div className={styles.selectWrapper}>
      <Select
        options={options}
        onChange={handleChange}
        placeholder='Select an account'
        selectedValue={selectedAccount?.address ?? null}
      />
    </div>
  );
};

export default AccountSelector;
