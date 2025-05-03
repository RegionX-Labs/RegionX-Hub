import { ApiResponse, fetchGraphql } from '@/graphql';
import { getNetworkCoretimeIndexer } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { getNetworkMetadata, getNetworkChainIds } from '@/network';

export const latestSaleRequested = createEvent<Network>();

export const $latestSaleInfo = createStore<SaleInfo | null>(null);

export type SaleInfo = {
  network: Network;
  saleCycle: number;
  saleStart: number;
  leadinLength: number;
  endPrice: string;
  regionBegin: number;
  regionEnd: number;
  idealCoresSold: number;
  coresOffered: number;
  startPrice: string;
  coresSold: number;
};

export const fetchSaleInfoAt = async (network: Network, saleCycle: number) => {
  const query = `{
    purchases(
      filter: { saleCycle: { equalTo: ${saleCycle} } }
      orderBy: HEIGHT_DESC
    ) {
      nodes {
        price
        purchaseType
      }
    }
  }`;

  const res = await fetchGraphql(getNetworkCoretimeIndexer(network), query);
  if (res.status !== 200) return null;

  return res.data.purchases.nodes;
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

const getLatestSaleInfoFx = createEffect(async (network: Network): Promise<SaleInfo | null> => {
  const res = await fetchLatestSaleInfo(network);
  const { status, data } = res;
  if (status !== 200) return null;

  const saleInfo: SaleInfo = {...data.sales.nodes[0], network};
  return saleInfo;
});

sample({
  clock: latestSaleRequested,
  target: getLatestSaleInfoFx,
});

sample({
  clock: getLatestSaleInfoFx.doneData,
  target: $latestSaleInfo,
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

export const fetchSelloutPrice = async (
  network: Network,
  connections: any
): Promise<bigint | null> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return null;

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const api = connection.client.getTypedApi(metadata.coretimeChain) as any;

  const saleInfo = await api.query.Broker.SaleInfo.getValue();

  return saleInfo?.sellout_price ?? null;
};
