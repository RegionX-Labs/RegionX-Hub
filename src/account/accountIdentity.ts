import { Connection } from '@/api/connection';
import { ChainId, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { Network } from '@/types';

type Payload = {
  accounts: { address: string }[];
  network: Network;
  connections: Record<ChainId, Connection>;
};

export const identityRequested = createEvent<Payload>();

export const $accountIdentities = createStore<
  Record<string, { name: string; hasJudgement: boolean }>
>({});

export const getAccountIdentitiesFx = createEffect(async (payload: Payload) => {
  const { network, accounts, connections } = payload;

  const chainIds = getNetworkChainIds(network);
  const metadata = getNetworkMetadata(network);
  if (!chainIds || !metadata) return {};

  const peopleConn = connections[chainIds.peopleChain];
  if (!peopleConn?.client || peopleConn.status !== 'connected') return {};

  const api = peopleConn.client.getTypedApi(metadata.peopleChain);

  const result: Record<string, { name: string; hasJudgement: boolean }> = {};

  for (const { address } of accounts) {
    const identityOpt = await api.query.Identity.IdentityOf.getValue(address);

    const name = identityOpt?.info?.display.value
      ? ((identityOpt.info.display.value as any)?.asText?.() ?? '')
      : '';

    const hasJudgement =
      Array.isArray(identityOpt?.judgements) && identityOpt.judgements.length > 0;

    if (name) {
      result[address] = { name, hasJudgement };
    }
  }

  return result;
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
