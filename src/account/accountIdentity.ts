import { createEffect, createStore, sample } from 'effector';
import { $connections, $network } from '@/api/connection';
import { $loadedAccounts } from '@/wallet';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';

export const $accountIdentities = createStore<Record<string, string>>({});

export const getAccountIdentitiesFx = createEffect(async () => {
  const network = $network.getState();
  const connections = $connections.getState();
  const accounts = $loadedAccounts.getState();

  const chainIds = getNetworkChainIds(network);
  const metadata = getNetworkMetadata(network);
  if (!chainIds || !metadata) return {};

  const peopleConn = connections[chainIds.peopleChain];
  if (!peopleConn?.client || peopleConn.status !== 'connected') return {};

  const api = peopleConn.client.getTypedApi(metadata.peopleChain);

  const identities: Record<string, string> = {};

  for (const { address } of accounts) {
    const identityOpt = await api.query.Identity.IdentityOf.getValue(address);
    const name = identityOpt?.info?.display?.raw?.toHuman?.() ?? null;
    if (name) identities[address] = name;
  }

  return identities;
});

sample({
  clock: $loadedAccounts.updates,
  target: getAccountIdentitiesFx,
});

sample({
  clock: getAccountIdentitiesFx.doneData,
  target: $accountIdentities,
});
