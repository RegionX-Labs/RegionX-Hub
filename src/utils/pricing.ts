import { Network } from '@/types';
import { SaleInfo } from '@/coretime/saleInfo';
import { fromUnit } from './format';

export const leadinFactorAt = (when: number) => {
  return when <= 0.5 ? 100 - when * 180 : 19 - when * 18;
};

export const getMinEndPrice = (network: Network): bigint => {
  switch (network) {
    case Network.POLKADOT:
    case Network.PASEO:
      return fromUnit(network, 10);
    case Network.KUSAMA:
    case Network.WESTEND:
      return fromUnit(network, 1);
    default:
      return BigInt(0);
  }
};

export const getCorePriceAt = (_now: number, saleInfo: SaleInfo, network: Network): number => {
  const { saleStart, leadinLength, endPrice } = saleInfo;
  const now = _now < saleStart ? saleStart : _now;
  const num = Math.min(now - saleStart, leadinLength);
  const through = num / leadinLength;
  return Number((leadinFactorAt(through) * Number(endPrice)).toFixed());
};

// All networks are now past the relay chain block migration.
export const usesRelayChainBlocks = (_network: Network, _saleInfo: SaleInfo): boolean => {
  return true;
};
