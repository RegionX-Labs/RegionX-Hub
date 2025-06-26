import { Connection } from '@/api/connection';
import {
  ChainId,
  CoretimeMetadata,
  RelayMetadata,
  getNetworkChainIds,
  getNetworkMetadata,
} from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

type DataRequestPayload = {
  account: string;
  network: Network;
  connections: Record<ChainId, Connection>;
};

export const getAccountData = createEvent<DataRequestPayload>();

export type MultiChainAccountData = {
  account: string;
  relayChainData: AccountData;
  coretimeChainData: AccountData;
  regionxChainData: AccountData | null;
};

type AccountData = {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
  flags: bigint;
};

export const $accountData = createStore<Record<string, MultiChainAccountData | null>>({});

const getAccountDataFx = createEffect(
  async (payload: DataRequestPayload): Promise<MultiChainAccountData | null> => {
    const { account, network, connections } = payload;

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      throw new Error('Network chain IDs not found');
    }

    const relayConnection = connections[networkChainIds.relayChain];
    const coretimeConnection = connections[networkChainIds.coretimeChain];
    const regionxConnection = connections[networkChainIds.regionxChain];

    if (
      !relayConnection ||
      !coretimeConnection ||
      !relayConnection.client ||
      !coretimeConnection.client ||
      relayConnection.status !== 'connected' ||
      coretimeConnection.status !== 'connected'
    ) {
      throw new Error('Connection not available');
    }
    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      throw new Error('Network metadata not found');
    }

    const _relayData = await fetchAccountData(relayConnection, metadata.relayChain, account);
    const _coretimeData = await fetchAccountData(
      coretimeConnection,
      metadata.coretimeChain,
      account
    );

    let _regionxData;
    if (regionxConnection && regionxConnection.client && regionxConnection.status === 'connected') {
      _regionxData = await fetchAccountData(regionxConnection, metadata.relayChain, account);
    }

    if (!_relayData || !_coretimeData) return null;

    return {
      account,
      coretimeChainData: _coretimeData,
      relayChainData: _relayData,
      regionxChainData: _regionxData ?? null,
    };
  }
);

const fetchAccountData = async (
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
  source: $accountData,
  filter: (_, newData) => newData !== null,
  fn: (accountsRecord, newData) => ({
    ...accountsRecord,
    [newData?.account || '']: newData,
  }),
  target: $accountData,
});
