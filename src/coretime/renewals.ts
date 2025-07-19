import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const potentialRenewalsRequested = createEvent<{ network: Network; connections: any }>();

type Assignment = { Task: number } | string;

type Completion =
  | {
      Complete: Array<{
        mask: string;
        assignment: Assignment;
      }>;
    }
  | { Partial: string };

export type RenewalKey = {
  core: number;
  when: number;
};

export type RenewalRecord = {
  completion: Completion;
  price: string;
};

type PotentialRenewalsMap = Map<RenewalKey, RenewalRecord>;
export const $potentialRenewals = createStore<PotentialRenewalsMap>(new Map());

const fetchPotentialRenewals = async (
  network: Network,
  connections: any
): Promise<PotentialRenewalsMap> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return new Map();

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return new Map();

  const metadata = getNetworkMetadata(network);
  if (!metadata) return new Map();

  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const potentialRenewals = await api.query.Broker.PotentialRenewals.getEntries();
  const map = new Map();
  for (const entry of potentialRenewals) {
    map.set(entry.keyArgs[0], { ...entry.value, price: entry.value.price.toString() });
  }

  return map;
};

const potentialRenewalsFx = createEffect(
  async (payload: { network: Network; connections: any }): Promise<PotentialRenewalsMap> => {
    return fetchPotentialRenewals(payload.network, payload.connections);
  }
);

sample({
  clock: potentialRenewalsRequested,
  target: potentialRenewalsFx,
});

sample({
  clock: potentialRenewalsFx.doneData,
  target: $potentialRenewals,
});

type AutoRenewalRecord = {
  core: number;
  next_renewal: number;
  task: number;
}

export const fetchAutoRenewals = async (
  network: Network,
  connections: any
): Promise<AutoRenewalRecord[]> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return [];

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return [];

  const metadata = getNetworkMetadata(network);
  if (!metadata) return [];

  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const entries: Array<AutoRenewalRecord> = await api.query.Broker.AutoRenewals.getValue();

  return entries;
};
