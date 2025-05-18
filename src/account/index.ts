import { Connection } from '@/api/connection';
import { ChainId, CoretimeMetadata, RelayMetadata, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

type DataRequestPayload = {
	account: string;
  network: Network;
	connections: Record<ChainId, Connection>;
};

export const getAccountData = createEvent<DataRequestPayload>();

type MultiAccountData = {
	relayChainData: AccountData;
	coretimeChainData: AccountData;
}

type AccountData = {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
  flags: bigint;
};

export const $accountData = createStore<Record<string, MultiAccountData>>({});

const getAccountDataFx = createEffect(async (payload: DataRequestPayload): Promise<Record<string, MultiAccountData>> => {
	const { account, network, connections } = payload;

  const networkChainIds = getNetworkChainIds(network);
  if (!networkChainIds) {
    throw new Error('Network chain IDs not found');
  }

  const relayConnection = connections[networkChainIds.relayChain];
  const coretimeConnection = connections[networkChainIds.coretimeChain];
  if (
    !relayConnection ||
    !coretimeConnection ||
    !relayConnection.client ||
    !coretimeConnection ||
    relayConnection.status !== 'connected' ||
    coretimeConnection.status !== 'connected'
  ) {
    throw new Error('Connection not available');
  }
  const metadata = getNetworkMetadata(network);
  if (!metadata) {
    throw new Error('Network metadata not found');
  }

  const _relayBalance = await fetchAccountData(
    relayConnection,
    metadata.relayChain,
		account
  );
  const _coretimeBalance = await fetchAccountData(
    coretimeConnection,
    metadata.coretimeChain,
    account
  );
  return {};
});

export const fetchAccountData = async (
  connection: Connection,
  metadata: RelayMetadata | CoretimeMetadata,
  account: string
): Promise<AccountData | null> => {
  const client = connection.client;
  if (!client || connection.status !== 'connected') {
    return null;
  }

  const res = await client.getTypedApi(metadata).query.System.Account.getValue(account);

  return res.data;
};

sample({
  clock: getAccountData,
  target: getAccountDataFx,
});

sample({
  clock: getAccountDataFx.doneData,
  target: $accountData,
});
