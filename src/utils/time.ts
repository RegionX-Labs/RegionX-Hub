import { getNetworkChainIds, getNetworkMetadata, CoretimeMetadata, RelayMetadata } from '@/network';
import { Network } from '@/types';
import { Connection } from '@/api/connection';
import { TIMESLICE_PERIOD } from './constants';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

export const timesliceToTimestamp = async (
  timeslice: number,
  network: Network,
  connections: any
): Promise<bigint | null> => {
  const associatedRelayChainBlock = timeslice * 80;
  const networkChainIds = getNetworkChainIds(network);
  if (!networkChainIds) return null;
  const connection = connections[networkChainIds.relayChain];
  if (!connection?.client || connection.status !== 'connected') return null;

  const client = connection.client;
  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const currentBlockNumber = await client
    .getTypedApi(metadata.relayChain)
    .query.System.Number.getValue();
  const timestamp = await client.getTypedApi(metadata.relayChain).query.Timestamp.Now.getValue();

  return timestamp - BigInt((currentBlockNumber - associatedRelayChainBlock) * 6000);
};

export const timestampToTimeslice = async (
  connections: any,
  timestamp: EpochTimeStamp,
  network: Network
): Promise<number> => {
  const networkChainIds = getNetworkChainIds(network);
  if (!networkChainIds) return 0;
  const connection = connections[networkChainIds.relayChain];
  if (!connection?.client || connection.status !== 'connected') return 0;

  const client = connection.client;
  const metadata = getNetworkMetadata(network);
  if (!metadata) return 0;

  const currentBlockNumber = await client
    .getTypedApi(metadata.relayChain)
    .query.System.Number.getValue();
  const now = Number(await client.getTypedApi(metadata.relayChain).query.Timestamp.Now.getValue());

  const diffInBlocks =
    now > timestamp
      ? currentBlockNumber - (now - timestamp) / 6000
      : currentBlockNumber + (timestamp - now) / 6000;

  return diffInBlocks / TIMESLICE_PERIOD;
};

export const blockToTimestamp = async (
  blockNumber: number,
  connection: Connection,
  metadata: RelayMetadata | CoretimeMetadata
): Promise<bigint | null> => {
  if (!connection.client || connection.status !== 'connected') return null;

  const client = connection.client;
  const typedApi = client.getTypedApi(metadata);
  const currentBlockNumber = await typedApi.query.System.Number.getValue();
  const timestamp = await typedApi.query.Timestamp.Now.getValue();
  let blockTime = (await typedApi.constants.Timestamp.MinimumPeriod()) * BigInt(2);
  blockTime = blockTime === BigInt(0) ? BigInt(6000) : blockTime;

  return timestamp + BigInt((BigInt(blockNumber) - BigInt(currentBlockNumber)) * blockTime);
};

export const coretimeChainBlockTime = (network: Network): number => {
  switch (network) {
    case Network.ROCOCO:
    case Network.WESTEND:
      return 6_000;
    case Network.KUSAMA:
    case Network.POLKADOT:
    case Network.PASEO:
      return 12_000;
    default:
      return 0;
  }
};

let ready = false;
function ensure() {
  if (!ready) {
    TimeAgo.addLocale(en);
    ready = true;
  }
}

export function getRelativeTime(input: bigint | number | Date): string {
  ensure();
  const timeAgo = new TimeAgo('en-US');

  let ms: number;
  if (input instanceof Date) {
    ms = input.getTime();
  } else if (typeof input === 'bigint') {
    const asNum = Number(input);
    ms = Number.isFinite(asNum) ? asNum : Date.now();
  } else {
    ms = input < 2_000_000_000 ? input * 1000 : input;
  }

  return timeAgo.format(ms, {
    steps: [
      { formatAs: 'second' },
      { formatAs: 'minute', minTime: 60 },
      { formatAs: 'hour', minTime: 60 * 60 },
      { formatAs: 'day', minTime: 24 * 60 * 60 },
    ],
    labels: 'long',
  });
}
