import { Network } from '@/types';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
} from '@/assets/networks/relay';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import styles from './network.module.scss';
import Select from '../elements/Select';

const NetworkSelector = () => {
  const router = useRouter();
  const network = useUnit($network);

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

  return (
    <Select
      selectedValue={network}
      onChange={handleChange}
      options={networks.map((network) => ({
        value: network.value,
        label: network.label,
        icon: network.icon,
      }))}
    />
  );
};

export default NetworkSelector;
