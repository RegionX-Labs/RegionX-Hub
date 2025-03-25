import { Network } from '@/types';

const toFixedWithoutRounding = (value: number, decimalDigits: number) => {
  const factor = Math.pow(10, decimalDigits);
  return Math.floor(value * factor) / factor;
};

export const formatWithDecimals = (amount: string, decimals: number): string => {
  if (amount == '0') return `0`;
  const amountNumber = Number(amount) / 10 ** decimals;
  if (amountNumber > 1) {
    return toFixedWithoutRounding(amountNumber, 2).toString();
  }

  let amountString = amountNumber.toFixed(decimals);

  // Find the position of the first non-zero digit
  const firstNonZeroPos = amountString.search(/[1-9]/);

  // Extract the part to keep and limit it to 3 characters after the first non-zero digit
  if (firstNonZeroPos !== -1) {
    amountString = amountString.slice(0, firstNonZeroPos + 3);
  }

  return amountString;
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

export const toUnitFormatted = (network: Network, amount: bigint): string => {
  let decimals;
  switch (network) {
    case Network.POLKADOT:
      decimals = 10;
      break;
    case Network.KUSAMA:
      decimals = 12;
      break;
    case Network.PASEO:
      decimals = 10;
      break;
    case Network.WESTEND:
      decimals = 12;
      break;
    default:
      decimals = 10;
      break;
  }

  const formatted = formatWithDecimals(amount.toString(), decimals);
  return `${formatted} ${getTokenSymbol(network)}`;
};
