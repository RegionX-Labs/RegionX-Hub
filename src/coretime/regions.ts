import { Connection } from '@/api/connection';
import { ChainId, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

type RegionsRequestPayload = {
  connections: Record<ChainId, Connection>;
  afterTimeslice: number;
  network: Network;
};
export const regionsRequested = createEvent<RegionsRequestPayload>();

export const $regions = createStore<Region[]>([]);

export enum RegionLocation {
  CoretimeChain,
  RegionxChain,
}

export type Region = {
  id: string;
  begin: number;
  core: number;
  mask: string;
  end: number;
  owner: string;
  paid?: string;
  task: number;
  location?: RegionLocation;
  locked?: boolean; // relevant only for regions on RegionX chain.
};

const getRegionsFx = createEffect(async (payload: RegionsRequestPayload): Promise<Region[]> => {
  const { connections, afterTimeslice, network } = payload;

  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return [];

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return [];

  const metadata = getNetworkMetadata(network);
  if (!metadata) return [];

  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const entries = await api.query.Broker.Regions.getEntries();

  const coretimeRegions: Region[] = entries
    .map((entry: any) => ({
      id: `${entry.keyArgs[0].begin}-${entry.keyArgs[0].core}-${entry.keyArgs[0].mask.asHex()}`,
      begin: entry.keyArgs[0].begin,
      core: entry.keyArgs[0].core,
      mask: entry.keyArgs[0].mask.asHex(),
      end: entry.value.end,
      owner: entry.value.owner ?? '',
      paid: entry.value.paid?.toString(),
      task: 0,
    }))
    .filter((r: Region) => r.begin >= afterTimeslice);

  let regionxRegions: Region[] = [];
  if (network === Network.KUSAMA) {
    regionxRegions = await getRegionxRegions(connections, network);
  }

  return coretimeRegions.map((r: Region) => {
    const match = regionxRegions.find(
      (_r) => _r.begin === r.begin && _r.core === r.core && _r.mask === r.mask
    );

    return {
      ...r,
      location: match ? RegionLocation.RegionxChain : RegionLocation.CoretimeChain,
      owner: match?.owner ?? r.owner,
      locked: match?.locked ?? false,
    };
  });
});

const getRegionxRegions = async (
  connections: Record<ChainId, Connection>,
  network: Network
): Promise<Region[]> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds || !chainIds.regionxChain) return [];

  const connection = connections[chainIds.regionxChain];
  if (!connection || !connection.client || connection.status !== 'connected') return [];

  const metadata = getNetworkMetadata(network);
  if (!metadata || !metadata.regionxChain) return [];

  const api = connection.client.getTypedApi(metadata.regionxChain);

  const regions = await api.query.Regions.Regions.getEntries();

  return regions.map((r) => ({
    id: `${r.keyArgs[0].begin}-${r.keyArgs[0].core}-${r.keyArgs[0].mask.asHex()}`,
    begin: r.keyArgs[0].begin,
    core: r.keyArgs[0].core,
    mask: r.keyArgs[0].mask.asHex(),
    owner: r.value.owner,
    locked: r.value.locked,
    end: 0, // unknown, we need ismp
    task: 0, // unknown, need ismp, but also not relevant
  }));
};

sample({
  clock: regionsRequested,
  target: getRegionsFx,
});

sample({
  clock: getRegionsFx.doneData,
  target: $regions,
});
