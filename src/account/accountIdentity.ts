import { createEffect, createEvent, createStore, sample } from 'effector';
import { Connection } from '@/api/connection';
import { ChainId, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import { Network } from '@/types';
import { PolkadotClient, TypedApi } from 'polkadot-api';

type Payload = {
  accounts: InjectedPolkadotAccount[];
  network: Network;
  connections: Record<ChainId, Connection>;
};
export const identityRequested = createEvent<Payload>();

export const $accountIdentities = createStore<Record<string, string>>({});

export const getAccountIdentitiesFx = createEffect(async (payload: Payload) => {
  const { network, accounts, connections } = payload;

  const chainIds = getNetworkChainIds(network);
  const metadata = getNetworkMetadata(network);
  if (!chainIds || !metadata) return {};

  const peopleConn = connections[chainIds.peopleChain];
  if (!peopleConn?.client || peopleConn.status !== 'connected') return {};

  const api = peopleConn.client.getTypedApi(metadata.peopleChain);

  const identities: Record<string, string> = {};

  for (const { address } of accounts) {
    const identityOpt = await api.query.Identity.IdentityOf.getValue(address);
    const name =
      identityOpt?.info?.display?.value &&
      typeof identityOpt.info.display.value === 'object' &&
      'toHuman' in identityOpt.info.display.value
        ? identityOpt.info.display.value.toHuman()
        : null;

    if (name && typeof name === 'string') {
      identities[address] = name;
    }
  }

  return identities;
});

sample({
  clock: identityRequested,
  target: getAccountIdentitiesFx,
});

sample({
  clock: getAccountIdentitiesFx.doneData,
  fn: (identities) => identities,
  target: $accountIdentities,
});
