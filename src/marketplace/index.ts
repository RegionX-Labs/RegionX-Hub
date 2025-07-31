import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { getNetworkMetadata, getNetworkChainIds } from '@/network';
import { Region } from '@/coretime/regions';

type RegionId = {
  begin: number;
  core: number;
  mask: string;
};

export type RegionListing = {
  region: Region;
  sale_recipeint: string;
  seller: string;
  timeslice_price: bigint;
};

type Payload = { network: Network; connections: any };
export const listedRegionsRequested = createEvent<Payload>();

export const $listedRegions = createStore<RegionListing[]>([]);

const getListedRegionsFx = createEffect(async (payload: Payload): Promise<RegionListing[]> => {
  const { network, connections } = payload;
  const listings = await fetchListedRegions(network, connections);

  return listings;
});

sample({
  clock: listedRegionsRequested,
  target: getListedRegionsFx,
});

sample({
  clock: getListedRegionsFx.doneData,
  target: $listedRegions,
});

const fetchListedRegions = async (network: Network, connections: any): Promise<RegionListing[]> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return [];

  const connection = connections[chainIds.regionxChain];
  if (!connection || !connection.client || connection.status !== 'connected') return [];

  const metadata = getNetworkMetadata(network);
  if (!metadata) return [];

  const api = connection.client.getTypedApi(metadata.regionxChain);

  const entries = await api.query.Market.Listings.getEntries();
  const listedRegions: RegionListing[] = [];
  for (const entry of entries) {
    const regionId = {
      core: entry.keyArgs[0].core,
      begin: entry.keyArgs[0].begin,
      mask: entry.keyArgs[0].mask,
    };

    const region = await fetchRegionData(network, connection, regionId);
    if (!region) continue;

    listedRegions.push({
      region: {
        ...region,
        mask: regionId.mask.asHex(),
      },
      ...entry.value,
    });
  }

  return listedRegions;
};

const fetchRegionData = async (
  network: Network,
  connection: any,
  regionId: RegionId
): Promise<Region | null> => {
  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const api = connection.client.getTypedApi(metadata.regionxChain);

  const { value } = (await api.query.Regions.Regions.getValue(regionId)).record;

  return {
    ...regionId,
    ...value,
  };
};
