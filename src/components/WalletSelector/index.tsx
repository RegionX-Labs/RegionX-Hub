import { $walletExtensions, walletSelected } from '@/wallet';
import { useUnit } from 'effector-react';
import { ChangeEvent } from 'react';

const WalletSelector = () => {
  const wallets = useUnit($walletExtensions);
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    walletSelected(e.target.value);
  };

  return (
    <div>
      <select id='network-select' name='network' onChange={handleChange}>
        {wallets.map((wallet) => (
          <option key={wallet.name} value={wallet.name}>
            {wallet.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WalletSelector;
