import React, { useState } from 'react';
import styles from './cross-chain.module.scss';
import { Select, AmountInput, AddressInput, Button } from '@region-x/components';
import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
} from '@/assets/networks/relay';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Network } from '@/types';

const CrossChain = () => {
  const router = useRouter();
  const network = useUnit($network);
  const [amount, setAmount] = useState('');

  const handleChange = (value: Network | null) => {
    if (value) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, network: value },
        },
        undefined,
        { shallow: false }
      );
    }
  };

  const networks = [
    {
      value: Network.POLKADOT,
      label: 'Polkadot',
      icon: (
        <Image
          src={PolkadotIcon.src}
          alt='Polkadot'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: Network.KUSAMA,
      label: 'Kusama',
      icon: (
        <Image
          src={KusamaIcon.src}
          alt='Kusama'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: Network.PASEO,
      label: 'Paseo',
      icon: (
        <Image
          src={PaseoIcon.src}
          alt='Paseo'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: Network.WESTEND,
      label: 'Westend',
      icon: (
        <Image
          src={WestendIcon.src}
          alt='Westend'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
  ];

  const filteredNetworks = networks.filter((n) => n.value === network);

  return (
    <div className={styles.container}>
      <div className={styles.chainSelectionContainer}>
        <label className={styles.sectionLabel}>Select Chains</label>

        <div className={styles.chainSelection}>
          <Select
            selectedValue={network}
            onChange={handleChange}
            options={filteredNetworks.map((network) => ({
              value: network.value,
              label: network.label,
              icon: network.icon,
            }))}
          />
        </div>

        <div className={styles.swapIcon}>⇅</div>

        <div className={styles.chainSelection}>
          <Select
            selectedValue={network}
            onChange={handleChange}
            options={filteredNetworks.map((network) => ({
              value: network.value,
              label: network.label,
              icon: network.icon,
            }))}
          />
        </div>
      </div>

      <div className={styles.transferSection}>
        <label>Transfer to</label>
        <AddressInput />

        <div className={styles.amountSection}>
          <label>Transfer Amount:</label>?{' '}
          <AmountInput
            currencyOptions={[{ value: network, label: network }]}
            onAmountChange={setAmount}
            placeholder='Enter amount'
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={() => console.log('Navigate home')}>Home</Button>
        <Button onClick={() => console.log('Transfer initiated')}>Transfer</Button>
      </div>
    </div>
  );
};

export default CrossChain;
