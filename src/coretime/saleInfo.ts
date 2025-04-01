import { ApiResponse, fetchGraphql } from '@/graphql';
import { getNetworkCoretimeIndexer } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const saleInfoRequested = createEvent<Network>();

export const $saleInfo = createStore<SaleInfo | null>(null);

export type SaleInfo = {
  saleCycle: number;
  saleStart: number;
  leadinLength: number;
  endPrice: string;
  regionBegin: number;
  regionEnd: number;
  idealCoresSold: number;
  coresOffered: number;
  startPrice: string;
};

const fetchLatestSaleInfo = async (network: Network): Promise<ApiResponse> => {
  const query = `{
    sales(orderBy: SALE_CYCLE_DESC, first: 1) {
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
  }`;
  return fetchGraphql(getNetworkCoretimeIndexer(network), query);
};

const getSaleInfoFx = createEffect(async (network: Network): Promise<SaleInfo | null> => {
  const res = await fetchLatestSaleInfo(network);
  const { status, data } = res;
  if (status !== 200) return null;

  const saleInfo: SaleInfo = data.sales.nodes[0];
  return saleInfo;
});

sample({
  clock: saleInfoRequested,
  target: getSaleInfoFx,
});

sample({
  clock: getSaleInfoFx.doneData,
  target: $saleInfo,
});

export const saleHistoryRequested = createEvent<Network>();

export const $saleHistory = createStore<SaleInfo[]>([]);

const fetchAllSalesFx = createEffect(async (network: Network): Promise<SaleInfo[]> => {
  const res = await fetchGraphql(
    getNetworkCoretimeIndexer(network),
    `{
      sales {
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
