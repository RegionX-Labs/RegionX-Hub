import { ApiResponse, fetchGraphql } from '@/graphql';
import { getNetworkCoretimeIndexer } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { getNetworkMetadata, getNetworkChainIds } from '@/network';

export const latestSaleRequested = createEvent<[Network, any]>();

export const $latestSaleInfo = createStore<SaleInfo | null>(null);

export enum SalePhase {
  Interlude,
  Leadin,
  FixedPrice,
};

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
  coresSold: number;
  firstCore: number
  selloutPrice: number;
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

const fetchLatestSaleCycle = async (network: Network): Promise<number | null> => {
  const res = await fetchGraphql(
    getNetworkCoretimeIndexer(network),
    `{
      sales(orderBy: SALE_CYCLE_DESC, first: 1) {
        nodes {
          saleCycle
        }
      }
    }`
  );

  const { status, data } = res;
  if (status !== 200) return null;
  return data.sales.nodes[0].saleCycle;
}

const fetchLatestSaleInfo = async (
  network: Network,
  connections: any
): Promise<SaleInfo | null> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return null;

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const api = connection.client.getTypedApi(metadata.coretimeChain) as any;

  const saleInfo = await api.query.Broker.SaleInfo.getValue();
  // The sale cycle is not inlcuded on chain so we have to fetch it from the indexer.
  const saleCycle = await fetchLatestSaleCycle(network);
  console.log(saleCycle);

  return { ...saleInfo, saleCycle };
};

const getLatestSaleInfoFx = createEffect(async (payload: [Network, any]): Promise<SaleInfo | null> => {
  const res = await fetchLatestSaleInfo(payload[0], payload[1]);

  return res;
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
