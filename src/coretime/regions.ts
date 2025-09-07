import { Connection } from '@/api/connection';
import { ApiResponse, fetchGraphql } from '@/graphql';
import {
  ChainId,
  getNetworkChainIds,
  getNetworkCoretimeIndexer,
  getNetworkMetadata,
} from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

type RegionsRequestPayload = {
  connections: Record<ChainId, Connection>;
  afterTimeslice: number;
  network: Network;
};
export const regionsRequested = createEvent<RegionsRequestPayload>();

export const $regions = createStore<Region[]>([]);

enum RegionLocation {
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

const fetchRegions = async (network: Network, afterTimeslice: number): Promise<ApiResponse> => {
  const query = `{
    regions(filter: { begin: { greaterThanOrEqualTo: ${afterTimeslice} } }) {
      nodes {
        id
        begin
        core
        mask
        end
        owner
        paid
        task
      }
    }
  }`;
  return fetchGraphql(getNetworkCoretimeIndexer(network), query);
};

const getRegionsFx = createEffect(async (payload: RegionsRequestPayload): Promise<Region[]> => {
  const res: ApiResponse = await fetchRegions(payload.network, payload.afterTimeslice);
  const { status, data } = res;
  if (status !== 200) return [];

  const regions = data.regions.nodes;

  // TODO: actually why i don't just filter regions from coretime chain based on if it is owned
  // by the sovereign account?
  // ANSWER: Because I can't see if it is locked or not. Based on if it is locked we should show
  // the region bit differently.
  // Also, I need to see the actual owner from the RegionX chain.
  let regionxRegions: Region[] = [];
  if (payload.network === Network.KUSAMA) {
    regionxRegions = await getRegionxRegions(payload.connections, payload.network);
  }

  console.log(regionxRegions);

  return regions.map((r: Region) => {
    const match = regionxRegions.find(
      (_r) => _r.begin === r.begin && _r.core === r.core && _r.mask === r.mask
    );
    console.log(match);
  
    return {
      ...r,
      location: match ? RegionLocation.RegionxChain : RegionLocation.CoretimeChain,
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
    task: 0, // unknwon, need ismp, but also not relevant
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
