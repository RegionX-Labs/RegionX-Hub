import { Network } from '@/types';
import KusamaChains from './kusama';
import PaseoChains from './paseo';
import PolkadotChains from './polkadot';
import RococoChains from './rococo';
import WestendChains from './westend';
import { BaseChainInfo, ChainDetails } from './types';

const transformData = (data: ChainDetails[]): Record<number, BaseChainInfo> => {
  const mapping: Record<number, BaseChainInfo> = {};
  data.forEach(({ paraId, text, ui = {}, homepage }) => {
    const { logo, color } = ui as { logo?: string; color?: string };
    mapping[paraId] = { name: text, logo, homepage, color };
  });
  return mapping;
};

const chainData: Record<Network, Record<number, BaseChainInfo>> = {
  [Network.POLKADOT]: transformData(PolkadotChains),
  [Network.KUSAMA]: transformData(KusamaChains),
  [Network.PASEO]: transformData(PaseoChains),
  [Network.ROCOCO]: transformData(RococoChains),
  [Network.WESTEND]: transformData(WestendChains),
  [Network.NONE]: transformData([]),
};

export { chainData };
