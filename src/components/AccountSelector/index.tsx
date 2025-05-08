import { $loadedAccounts, accountSelected, SELECTED_WALLET_KEY, walletSelected } from '@/wallet';
import { useUnit } from 'effector-react';
import Identicon from '@polkadot/react-identicon';
import styles from './account.module.scss';
import Select from '../elements/Select';

const AccountSelector = () => {
  const accounts = useUnit($loadedAccounts);

  const handleChange = (value: string | null) => {
    if (value === 'disconnect') {
      console.log('disconnect');
      walletSelected('');
      localStorage.removeItem(SELECTED_WALLET_KEY);
      return;
    }
    if (value) {
      accountSelected(value);
    }
  };

  const formatAddress = (address: string): string => {
    const formattedAddress = `${address.slice(0, 4)}...${address.slice(-6)}`;
    return formattedAddress;
  };

  const options = accounts.map((account) => {
    return {
      key: `${formatAddress(account.address)}`,
      value: account.address,
      label: `${formatAddress(account.address)}`, //(${account.name})
      icon: (
        <div className={styles.icon}>
          <Identicon value={account.address} size={24} theme='polkadot' />
        </div>
      ),
    };
  });

  options.push({
    key: 'disconnect',
    value: 'disconnect',
    label: 'Disconnect',
    icon: <></>,
  });

  return (
    <div className={styles.selectWrapper}>
      <Select options={options} onChange={handleChange} placeholder='Select an account' />
    </div>
  );
};

export default AccountSelector;
