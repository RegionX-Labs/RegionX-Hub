import { Network } from '@/types';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { SaleInfo } from '@/coretime/saleInfo';

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

export const timesliceToTimestamp = async (
  timeslice: number,
  network: Network,
  connections: any
): Promise<bigint | null> => {
  const associatedRelayChainBlock = timeslice * 80;
  const networkChainIds = getNetworkChainIds(network);
  if (!networkChainIds) return null;
  const connection = connections[networkChainIds.relayChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const client = connection.client;
  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const currentBlockNumber = await (
    client.getTypedApi(metadata.relayChain) as any
  ).query.System.Number.getValue();

  const timestamp = await (
    client.getTypedApi(metadata.relayChain) as any
  ).query.Timestamp.Now.getValue();

  const estimatedTimestamp =
    timestamp - BigInt((currentBlockNumber - associatedRelayChainBlock) * 6000);
  return estimatedTimestamp;
};

export const blockToTimestamp = async (
  blockNumber: number,
  network: Network,
  connections: any
): Promise<bigint | null> => {
  const networkChainIds = getNetworkChainIds(network);
  if (!networkChainIds) return null;
  const connection = connections[networkChainIds.relayChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const client = connection.client;
  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const currentBlockNumber = await (
    client.getTypedApi(metadata.relayChain) as any
  ).query.System.Number.getValue();

  const timestamp = await (
    client.getTypedApi(metadata.relayChain) as any
  ).query.Timestamp.Now.getValue();

  const estimatedTimestamp = timestamp - BigInt((currentBlockNumber - blockNumber) * 6000);
  return estimatedTimestamp;
};

// Utility for Dutch auction decay (leadin price drop factor)
export const leadinFactorAt = (when: number) => {
  if (when <= 0.5) {
    return 100 - when * 180;
  } else {
    return 19 - when * 18;
  }
};

// The price of a core at a specific block number
export const getCorePriceAt = (now: number, saleInfo: SaleInfo): number => {
  /* NOTE: the runtime api is not implemented for Kusama.
  const salePrice = await coretimeApi.rpc.state.call('BrokerApi_sale_price', '');
  const price = coretimeApi.createType('Option<u128>', salePrice);
  */

  const { saleStart, leadinLength, endPrice } = saleInfo;
  var now = now < saleStart ? saleStart : now;

  const num = Math.min(now - saleStart, leadinLength);
  const through = num / leadinLength;

  const price = leadinFactorAt(through) * Number(endPrice);
  return Number(price.toFixed());
};
