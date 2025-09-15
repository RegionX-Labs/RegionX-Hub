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

const DISABLED_NETWORKS = new Set<Network>([Network.WESTEND]);

const NetworkSelector = () => {
  const router = useRouter();
  const current = useUnit($network);
  const selectedValue = DISABLED_NETWORKS.has(current) ? Network.POLKADOT : current;

  const handleChange = (value: Network | null) => {
    if (!value) return;
    if (DISABLED_NETWORKS.has(value)) return;
    router.push(
      { pathname: router.pathname, query: { ...router.query, network: value } },
      undefined,
      { shallow: false }
    );
  };

  const networks = [
    {
      key: 'Polkadot',
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
      key: 'Kusama',
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
      key: 'Paseo',
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
      key: 'Westend',
      value: Network.WESTEND,
      label: 'Westend',
      disabled: true,
      icon: (
        <Image
          src={WestendIcon.src}
          alt='Westend'
          className={`${styles.smallIcon} ${styles.disabledLook}`}
          width={20}
          height={20}
        />
      ),
    },
  ];

  return (
    <Select
      selectedValue={selectedValue}
      onChange={handleChange}
      options={networks}
      isOptionDisabled={(v) => v === Network.WESTEND}
      searchable={false}
    />
  );
};

export default NetworkSelector;
