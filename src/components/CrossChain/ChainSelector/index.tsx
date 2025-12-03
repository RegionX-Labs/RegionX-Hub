import React, { useEffect } from 'react';
import Image from 'next/image';
import { ChainId, chains } from '@/network';
import styles from './chain-selector.module.scss';
import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
  RegionX as RegionXIcon,
  KusamaCoretime,
  PaseoCoretime,
  PolkadotCoretime,
  WestendCoretime,
} from '@/assets/networks';
import Select from '@/components/elements/Select';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';

interface ChainSelectorProps {
  selectedValue: ChainId | null;
  onChange: (chainId: ChainId | null) => void;
}

const ChainSelector = ({ selectedValue, onChange }: ChainSelectorProps) => {
  const network = useUnit($network);

  const networks = [
    {
      value: chains.polkadotAH.chainId,
      label: 'Polkadot AssetHub',
      icon: (
        <Image
          src={PolkadotIcon.src}
          alt='Polkadot AssetHub'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.kusamaAH.chainId,
      label: 'Kusama AssetHub',
      icon: (
        <Image
          src={KusamaIcon.src}
          alt='Kusama AssetHub'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.paseoAH.chainId,
      label: 'Paseo Asset Hub',
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
      value: chains.westend.chainId,
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
    {
      value: chains.polkadotCoretime.chainId,
      label: 'Polkadot Coretime',
      icon: (
        <Image
          src={PolkadotCoretime.src}
          alt='Polkadot Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.kusamaCoretime.chainId,
      label: 'Kusama Coretime',
      icon: (
        <Image
          src={KusamaCoretime.src}
          alt='Kusama Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.regionxKusama.chainId,
      label: 'RegionX Kusama',
      icon: (
        <Image
          src={RegionXIcon.src}
          alt='RegionX Chain'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.paseoCoretime.chainId,
      label: 'Paseo Coretime',
      icon: (
        <Image
          src={PaseoCoretime.src}
          alt='Paseo Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
    {
      value: chains.westendCoretime.chainId,
      label: 'Westend Coretime',
      icon: (
        <Image
          src={WestendCoretime.src}
          alt='Westend Coretime'
          className={styles.smallIcon}
          width={20}
          height={20}
        />
      ),
    },
  ];

  const isCoretimeChain = (chainId: string): boolean => {
    return chainId === chains[`${network}Coretime` as keyof typeof chains]?.chainId;
  };

  const isAhChain = (chainId: string): boolean => {
    return chainId === chains[`${network}AH` as keyof typeof chains]?.chainId;
  };

  const isRegionXChain = (chainId: string): boolean => {
    const capitalize = (str: string): string => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return chainId === chains[`regionx${capitalize(network)}` as keyof typeof chains]?.chainId;
  };

  const filteredNetworks = networks.filter((n) => {
    if (!network) return true;
    return (
      n.value === chains[network as keyof typeof chains]?.chainId ||
      isCoretimeChain(n.value) ||
      isRegionXChain(n.value) ||
      isAhChain(n.value)
    );
  });

  useEffect(() => {
    if (filteredNetworks.length > 0) {
      const isOriginChainValid = filteredNetworks.some((n) => n.value === selectedValue);

      if (!isOriginChainValid) onChange(filteredNetworks[0].value);
    }
  }, [filteredNetworks, selectedValue, onChange]);

  return (
    <Select<ChainId>
      selectedValue={selectedValue}
      onChange={onChange}
      options={filteredNetworks.map((network) => ({
        key: String(network.value),
        value: network.value,
        label: network.label,
        icon: network.icon,
      }))}
    />
  );
};

export default ChainSelector;
