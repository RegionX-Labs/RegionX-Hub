import { ApiResponse, fetchGraphql } from '@/graphql';
import { getNetworkCoretimeIndexer } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { getNetworkMetadata, getNetworkChainIds } from '@/network';
import {
  blockToTimestamp,
  coretimeChainBlockTime,
  RELAY_CHAIN_BLOCK_TIME,
  TIMESLICE_PERIOD,
} from '@/utils';
import { $connections, $network } from '@/api/connection';
import { RegionData } from '@/types/type';

export const listedRegionsRequested = createEvent<Network>();

export const $listedRegions = createStore<RegionData[]>([]);

const getListedRegionsFx = createEffect(async (network: Network): Promise<RegionData[]> => {
  

  return [];
});

sample({
  clock: listedRegionsRequested,
  target: getListedRegionsFx,
});

sample({
  clock: getListedRegionsFx.doneData,
  target: $listedRegions,
});

export const saleHistoryRequested = createEvent<Network>();

export const $saleHistory = createStore<SaleInfo[]>([]);

const fetchAllSalesFx = createEffect(async (network: Network): Promise<SaleInfo[]> => {
  const res = await fetchGraphql(
    getNetworkCoretimeIndexer(network),
    `{
       sales(orderBy: SALE_CYCLE_DESC) {
      nodes {
        saleCycle
        startPrice
        endPrice
        regionEnd
        regionBegin
        saleStart
        leadinLength
        idealCoresSold
        coresOffered
      }
    }
  }`
  );

  const { status, data } = res;
  if (status !== 200) return [];
  return data.sales.nodes;
});

sample({
  clock: saleHistoryRequested,
  target: fetchAllSalesFx,
});

sample({
  clock: fetchAllSalesFx.doneData,
  target: $saleHistory,
});

export const fetchListedRegions = async (
  network: Network,
  connections: any
): Promise<bigint | null> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return null;

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const saleInfo = await api.query.Broker.SaleInfo.getValue();

  return saleInfo?.sellout_price ?? null;
};
