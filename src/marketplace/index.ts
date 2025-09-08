import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { getNetworkMetadata, getNetworkChainIds, NetworkChainIds, ChainId } from '@/network';
import { Region } from '@/coretime/regions';
import { Connection } from '@/api/connection';
import { FixedSizeBinary } from 'polkadot-api';

type RegionId = {
  begin: number;
  core: number;
  mask: FixedSizeBinary<10>;
};

export type RegionListing = {
  region: Region;
  sale_recipient: string;
  seller: string;
  price_data: bigint;
};

type Payload = { network: Network; connections: Record<ChainId, Connection> };
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

const fetchListedRegions = async (
  network: Network,
  connections: Record<ChainId, Connection>
): Promise<RegionListing[]> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds || !chainIds.regionxChain) return [];

  const connection = connections[chainIds.regionxChain];
  if (!connection || !connection.client || connection.status !== 'connected') return [];

  const metadata = getNetworkMetadata(network);
  if (!metadata || !metadata.regionxChain) return [];

  const api = connection.client.getTypedApi(metadata.regionxChain);

  const entries = await api.query.Market.Listings.getEntries();
  const listedRegions: RegionListing[] = [];
  for (const entry of entries) {
    const regionId = {
      core: entry.keyArgs[0].core,
      begin: entry.keyArgs[0].begin,
      mask: entry.keyArgs[0].mask,
    };

    const region = await fetchRegionData(network, connections, chainIds, regionId);
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
  connections: Record<ChainId, Connection>,
  chainIds: NetworkChainIds,
  regionId: RegionId
): Promise<Region | null> => {
  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  // TODO: fetch metadata from the RegionX chain.
  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const value = await api.query.Broker.Regions.getValue(regionId);

  if (!value) return null;

  return {
    id: `${regionId.begin}-${regionId.core}-${regionId.mask.asHex()}`,
    begin: regionId.begin,
    core: regionId.core,
    mask: regionId.mask.asHex(),
    end: value.end,
    paid: value.paid?.toString() ?? undefined,
    owner: value.owner?.toString() || '',
    task: 0,
  };
};
