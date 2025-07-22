import { Network } from '@/types';

const toFixedWithoutRounding = (value: number, decimalDigits: number) => {
  const factor = Math.pow(10, decimalDigits);
  return Math.floor(value * factor) / factor;
};

export const formatWithDecimals = (amount: string, decimals: number): number => {
  if (amount == '0') return 0;
  const amountNumber = Number(amount) / 10 ** decimals;
  if (amountNumber > 1) {
    return toFixedWithoutRounding(amountNumber, 2);
  }

  let amountString = amountNumber.toFixed(decimals);
  const firstNonZeroPos = amountString.search(/[1-9]/);
  if (firstNonZeroPos !== -1) {
    amountString = amountString.slice(0, firstNonZeroPos + 3);
  }

  return Number(amountString);
};

export const getTokenSymbol = (network: Network): string => {
  switch (network) {
    case Network.POLKADOT:
      return 'DOT';
    case Network.KUSAMA:
      return 'KSM';
    case Network.PASEO:
      return 'PAS';
    case Network.WESTEND:
      return 'WND';
    default:
      return 'TOKEN';
  }
};

const getNetworkDecimals = (network: Network): number => {
  switch (network) {
    case Network.POLKADOT:
    case Network.PASEO:
      return 10;
    case Network.KUSAMA:
    case Network.WESTEND:
      return 12;
    default:
      return 10;
  }
};

export const toUnit = (network: Network, amount: bigint): number => {
  const decimals = getNetworkDecimals(network);
  return formatWithDecimals(amount.toString(), decimals);
};

export const toUnitFormatted = (network: Network, amount: bigint): string => {
  const decimals = getNetworkDecimals(network);
  const formatted = formatWithDecimals(amount.toString(), decimals);
  return `${formatted} ${getTokenSymbol(network)}`;
};

export const fromUnit = (network: Network, amount: number): bigint => {
  const decimals = getNetworkDecimals(network);
  return BigInt(amount * Math.pow(10, decimals));
};
