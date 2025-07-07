import { Connection } from '@/api/connection';
import {
  ChainId,
  CoretimeMetadata,
  RelayMetadata,
  getNetworkChainIds,
  getNetworkMetadata,
} from '@/network';
import { PeopleMetadata } from '@/network';
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
  peopleChainData: AccountData;
};

type AccountData = {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
  flags: bigint;
};

export const $accountData = createStore<Record<string, MultiChainAccountData | null>>({});

export const getAccountDataFx = createEffect(
  async (payload: DataRequestPayload): Promise<MultiChainAccountData | null> => {
    const { account, network, connections } = payload;

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      console.error('[Account Fetch] Network chain IDs not found');
      return null;
    }

    const relayConnection = connections[networkChainIds.relayChain];
    const coretimeConnection = connections[networkChainIds.coretimeChain];
    const peopleConnection = connections[networkChainIds.peopleChain];

    if (
      !relayConnection ||
      !relayConnection.client ||
      relayConnection.status !== 'connected' ||
      !coretimeConnection ||
      !coretimeConnection.client ||
      coretimeConnection.status !== 'connected' ||
      !peopleConnection ||
      !peopleConnection.client ||
      peopleConnection.status !== 'connected'
    ) {
      console.error('[Account Fetch] One or more chain connections are unavailable', {
        relay: relayConnection?.status,
        coretime: coretimeConnection?.status,
        people: peopleConnection?.status,
      });
      return null;
    }

    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      console.error('[Account Fetch] Network metadata not found');
      return null;
    }

    const [relayData, coretimeData, peopleData] = await Promise.all([
      fetchAccountData(relayConnection, metadata.relayChain, account),
      fetchAccountData(coretimeConnection, metadata.coretimeChain, account),
      fetchAccountData(peopleConnection, metadata.peopleChain, account),
    ]);

    if (!relayData || !coretimeData || !peopleData) {
      console.warn('[Account Fetch] Some data could not be fetched', {
        relayData,
        coretimeData,
        peopleData,
      });
      return null;
    }

    console.log('[Account Fetch] Relay chain data:', relayData);
    console.log('[Account Fetch] Coretime chain data:', coretimeData);
    console.log('[Account Fetch] People chain data:', peopleData);

    return {
      account,
      relayChainData: relayData,
      coretimeChainData: coretimeData,
      peopleChainData: peopleData,
    };
  }
);

const fetchAccountData = async (
  connection: Connection,
  metadata: RelayMetadata | CoretimeMetadata | PeopleMetadata,
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
