import { Network } from '@/types';
import { CoretimeMetadata, RelayMetadata, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { SaleInfo } from '@/coretime/saleInfo';
import { Connection } from '@/api/connection';
import { FixedSizeBinary } from 'polkadot-api';

export const TIMESLICE_PERIOD = 80;
export const RELAY_CHAIN_BLOCK_TIME = 6000;

export const CORETIME_PARA_ID = 1005;

export type RegionId = {
  begin: number;
  core: number;
  mask: FixedSizeBinary<10>;
};

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

  // Find the position of the first non-zero digit
  const firstNonZeroPos = amountString.search(/[1-9]/);

  // Extract the part to keep and limit it to 3 characters after the first non-zero digit
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
      return 10;
    case Network.KUSAMA:
      return 12;
    case Network.PASEO:
      return 10;
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

export const fromUnit = (network: Network, amount: bigint): bigint => {
  const decimals = getNetworkDecimals(network);
  return amount * BigInt(Math.pow(10, decimals));
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

  const currentBlockNumber = await client
    .getTypedApi(metadata.relayChain)
    .query.System.Number.getValue();

  const timestamp = await client.getTypedApi(metadata.relayChain).query.Timestamp.Now.getValue();

  const estimatedTimestamp =
    timestamp - BigInt((currentBlockNumber - associatedRelayChainBlock) * 6000);
  return estimatedTimestamp;
};

export const timestampToTimeslice = async (
  connections: any,
  timestamp: EpochTimeStamp,
  network: Network
): Promise<number> => {
  // We have the current block number and the corresponding timestamp.
  // Assume that 1 block ~ 6 seconds..
  const networkChainIds = getNetworkChainIds(network);
  if (!networkChainIds) return 0;
  const connection = connections[networkChainIds.relayChain];
  if (!connection || !connection.client || connection.status !== 'connected') return 0;

  const client = connection.client;
  const metadata = getNetworkMetadata(network);
  if (!metadata) return 0;

  const currentBlockNumber = await client
    .getTypedApi(metadata.relayChain)
    .query.System.Number.getValue();

  const now = Number(await client.getTypedApi(metadata.relayChain).query.Timestamp.Now.getValue());
  if (now > timestamp) {
    const diffInBlocks = currentBlockNumber - (now - timestamp) / 6000;
    return diffInBlocks / TIMESLICE_PERIOD;
  } else {
    const diffInBlocks = currentBlockNumber + (timestamp - now) / 6000;
    return diffInBlocks / TIMESLICE_PERIOD;
  }
};

export const blockToTimestamp = async (
  blockNumber: number,
  connection: Connection,
  metadata: RelayMetadata | CoretimeMetadata,
  network: Network
): Promise<bigint | null> => {
  if (!connection.client || connection.status !== 'connected') return null;

  const client = connection.client;
  if (!metadata) return null;

  const typedApi = client.getTypedApi(metadata);
  const currentBlockNumber = await typedApi.query.System.Number.getValue();
  const timestamp = await typedApi.query.Timestamp.Now.getValue();

  const blockTime = network === Network.WESTEND ? 6000 : 12000;

  const estimatedTimestamp =
    timestamp + BigInt((blockNumber - Number(currentBlockNumber)) * blockTime);
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
export const getCorePriceAt = (_now: number, saleInfo: SaleInfo): number => {
  /* NOTE: the runtime api is not implemented for Kusama.
  const salePrice = await coretimeApi.rpc.state.call('BrokerApi_sale_price', '');
  const price = coretimeApi.createType('Option<u128>', salePrice);
  */

  const { saleStart, leadinLength, endPrice } = saleInfo;
  const now = _now < saleStart ? saleStart : _now;

  const num = Math.min(now - saleStart, leadinLength);
  const through = num / leadinLength;

  const price = leadinFactorAt(through) * Number(endPrice);
  return Number(price.toFixed());
};

export const coretimeChainBlockTime = (network: Network) => {
  switch (network) {
    case Network.ROCOCO:
      return 6 * 1000;
    case Network.KUSAMA:
      return 12 * 1000;
    case Network.POLKADOT:
      return 12 * 1000;
    case Network.PASEO:
      return 12 * 1000;
    case Network.WESTEND:
      return 6 * 1000;
    default:
      return 0;
  }
};

export function maskToBin(mask: string): string {
  let bin = '';
  for (let i = 2; i < mask.length; ++i) {
    const v = parseInt(mask.slice(i, i + 1), 16);
    for (let j = 3; j >= 0; --j) {
      bin += v & (1 << j) ? '1' : '0';
    }
  }
  return bin;
}

export function bitStringToUint8Array(bits: string): Uint8Array {
  if (bits.length % 8 !== 0) {
    throw new Error('Bit string must be divisible by 8');
  }

  const bytes = new Uint8Array(bits.length / 8);

  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    bytes[i / 8] = parseInt(byte, 2);
  }

  return bytes;
}

export const countBits = (regionMask: string) => {
  let count = 0;
  // Convert hex to bits and count ones.
  for (let i = 2; i < regionMask.length; ++i) {
    let v = parseInt(regionMask.slice(i, i + 1), 16);
    while (v > 0) {
      if (v & 1) ++count;
      v >>= 1;
    }
  }
  return count;
};
