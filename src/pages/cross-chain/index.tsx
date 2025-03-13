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

type ExtendedNetwork = Network | `${Network}_CORETIME`;

const CrossChain = () => {
  const router = useRouter();
  const network = useUnit($network);

  const [originChain, setOriginChain] = useState<ExtendedNetwork | null>(null);
  const [destinationChain, setDestinationChain] = useState<ExtendedNetwork | null>(null);
  const [amount, setAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');

  const handleOriginChainChange = (value: ExtendedNetwork | null) => {
    setOriginChain(value);
  };

  const handleDestinationChainChange = (value: ExtendedNetwork | null) => {
    setDestinationChain(value);
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeneficiary(e.target.value);
  };

  const handleTransfer = () => {
    console.log('Transfer initiated with:', {
      originChain,
      destinationChain,
      amount,
      beneficiary,
    });
  };

  const handleSwapChains = () => {
    const temp = originChain;
    setOriginChain(destinationChain);
    setDestinationChain(temp);
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

  const networksWithCoretime = networks.map((network) => ({
    ...network,
    value: `${network.value}_CORETIME` as ExtendedNetwork,
    label: `${network.label} Coretime`,
  }));

  const allNetworks = [...networks, ...networksWithCoretime];

  const filteredNetworks = allNetworks.filter((n) => (network ? n.value.includes(network) : true));

  return (
    <div className={styles.container}>
      <div className={styles.chainSelectionContainer}>
        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Origin chain:</label>

          <Select<ExtendedNetwork>
            selectedValue={originChain}
            onChange={handleOriginChainChange}
            options={filteredNetworks.map((network) => ({
              value: network.value,
              label: network.label,
              icon: network.icon,
            }))}
          />
        </div>

        <div className={styles.swapIcon} onClick={handleSwapChains}>
          ⇅
        </div>

        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Destination chains</label>

          <Select<ExtendedNetwork>
            selectedValue={destinationChain}
            onChange={handleDestinationChainChange}
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
        <AddressInput
          onChange={handleBeneficiaryChange}
          value={beneficiary}
          placeholder='Address of the recipient'
        />

        <div className={styles.amountSection}>
          <label>Transfer Amount:</label>
          <AmountInput
            currencyOptions={[{ value: network, label: network }]}
            onAmountChange={setAmount}
            placeholder='Enter amount'
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <Button onClick={() => router.push('/')}>Home</Button>
        <Button onClick={handleTransfer}>Transfer</Button>
      </div>
    </div>
  );
};

export default CrossChain;
