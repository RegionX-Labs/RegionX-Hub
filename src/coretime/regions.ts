import { ApiResponse, fetchGraphql } from '@/graphql';
import { getNetworkCoretimeIndexer } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

type RegionsRequestPayload = {
  afterTimeslice: number;
  network: Network;
};
export const regionsRequested = createEvent<RegionsRequestPayload>();

export const $regions = createStore<Region[]>([]);

export type Region = {
  id: string;
  begin: number;
  core: number;
  mask: string;
  end: number;
  owner: string;
  paid: string;
  task: number;
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

  return regions.map((r: any) => {
    return r as Region;
  });
});

sample({
  clock: regionsRequested,
  target: getRegionsFx,
});

sample({
  clock: getRegionsFx.doneData,
  target: $regions,
});
