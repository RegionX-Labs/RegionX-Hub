import React from 'react';
import Image from 'next/image';
import { ChainId, chains } from '@/network';
import styles from './amount-input.module.scss';

import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
} from '@/assets/networks';
import AmountInput from '@/components/elements/AmountInput/AmountInput';

interface CrossChainAmountInputProps {
  originChain: ChainId | null;
  setAmount: (amount: string) => void;
}

const CrossChainAmountInput = ({ originChain, setAmount }: CrossChainAmountInputProps) => {
  const currencyMapping: Record<ChainId, { symbol: string; icon: any }> = {
    [chains.polkadot.chainId]: { symbol: 'DOT', icon: PolkadotIcon },
    [chains.kusama.chainId]: { symbol: 'KSM', icon: KusamaIcon },
    [chains.paseo.chainId]: { symbol: 'PAS', icon: PaseoIcon },
    [chains.westend.chainId]: { symbol: 'WND', icon: WestendIcon },
    [chains.polkadotCoretime.chainId]: { symbol: 'DOT', icon: PolkadotIcon },
    [chains.kusamaCoretime.chainId]: { symbol: 'KSM', icon: KusamaIcon },
    [chains.polkadotAH.chainId]: { symbol: 'DOT', icon: PolkadotIcon },
    [chains.kusamaAH.chainId]: { symbol: 'KSM', icon: KusamaIcon },
    [chains.regionxKusama.chainId]: { symbol: 'KSM', icon: KusamaIcon },
    [chains.paseoCoretime.chainId]: { symbol: 'PAS', icon: PaseoIcon },
    [chains.westendCoretime.chainId]: { symbol: 'WND', icon: WestendIcon },
  };

  const selectedCurrency = originChain ? currencyMapping[originChain] : null;

  return (
    <AmountInput
      currencyOptions={
        selectedCurrency
          ? [
              {
                key: selectedCurrency.symbol,
                value: selectedCurrency.symbol,
                label: selectedCurrency.symbol,
                icon: (
                  <Image
                    src={selectedCurrency.icon.src}
                    alt={selectedCurrency.symbol}
                    className={styles.smallIcon}
                    width={20}
                    height={20}
                  />
                ),
              },
            ]
          : []
      }
      onAmountChange={setAmount}
      placeholder='Enter amount'
    />
  );
};

export default CrossChainAmountInput;
