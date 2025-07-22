import { Network } from '@/types';
import { fromUnit } from './format';
import { SaleInfo } from '@/coretime/saleInfo';

export const leadinFactorAt = (when: number) => {
  if (when <= 0.5) return 100 - when * 180;
  else return 19 - when * 18;
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
  const price = leadinFactorAt(through) * Number(endPrice);
  return Number(price.toFixed());
};
