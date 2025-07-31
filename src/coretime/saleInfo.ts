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
  usesRelayChainBlocks,
} from '@/utils';
import { $connections, $network } from '@/api/connection';

export enum SalePhase {
  Interlude = 'Interlude Phase',
  Leadin = 'Leadin Phase',
  FixedPrice = 'Fixed Price Phase',
}

export const salePhases: SalePhase[] = [
  SalePhase.Interlude,
  SalePhase.Leadin,
  SalePhase.FixedPrice,
];

type Endpoints = {
  start: number;
  end: number;
};

type PhaseEndpoints = {
  interlude: Endpoints;
  leadin: Endpoints;
  fixed: Endpoints;
};

type Configuration = {
  advance_notice: number;
  interlude_length: number;
  leadin_length: number;
  region_length: number;
  ideal_bulk_proportion: number;
  limit_cores_offered: number;
  renewal_bump: number;
  contribution_timeout: number;
};

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
  coresSold: number | undefined;
};

export const latestSaleRequested = createEvent<Network>();

export const $latestSaleInfo = createStore<SaleInfo | null>(null);
export const $phaseEndpoints = createStore<PhaseEndpoints | null>(null);

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

  const saleInfo: SaleInfo = { ...data.sales.nodes[0], network };
  return saleInfo;
});

type GetPhaseEndpointsPayload = {
  network: Network;
  saleInfo: SaleInfo | null;
  connections: any;
};
const getSalePhaseEndpointsFx = createEffect(
  async (payload: GetPhaseEndpointsPayload): Promise<PhaseEndpoints | null> => {
    const { connections, network, saleInfo } = payload;
    if (!saleInfo) return null;
    const chainIds = getNetworkChainIds(network);
    if (!chainIds) return null;
    const metadata = getNetworkMetadata(network);
    if (!metadata) return null;

    const connection = connections[chainIds.relayChain];
    if (!connection) return null;
    const saleStartTimestamp = Number(
      await blockToTimestamp(saleInfo.saleStart, connection, metadata.relayChain)
    );

    const regionDuration = saleInfo.regionEnd - saleInfo.regionBegin;
    const config = await fetchBrokerConfig(network, connections);
    if (!config) return null;

    // In the new release everything is defined in relay chain blocks.
    const blockTime = usesRelayChainBlocks(network, saleInfo)
      ? RELAY_CHAIN_BLOCK_TIME
      : coretimeChainBlockTime(network);

    const saleEndTimestamp =
      saleStartTimestamp -
      config?.interlude_length * blockTime +
      regionDuration * TIMESLICE_PERIOD * RELAY_CHAIN_BLOCK_TIME;

    const endpoints = {
      interlude: {
        start: saleStartTimestamp - config.interlude_length * blockTime,
        end: saleStartTimestamp,
      },
      leadin: {
        start: saleStartTimestamp,
        end: saleStartTimestamp + config.leadin_length * blockTime,
      },
      fixed: {
        start: saleStartTimestamp + config.leadin_length * blockTime,
        end: saleEndTimestamp,
      },
    };

    return endpoints;
  }
);

sample({
  clock: latestSaleRequested,
  target: getLatestSaleInfoFx,
});

sample({
  clock: getLatestSaleInfoFx.doneData,
  target: $latestSaleInfo,
});

sample({
  clock: getLatestSaleInfoFx.doneData,
  source: {
    connections: $connections,
    network: $network,
  },
  fn: ({ connections, network }, saleInfo) => ({
    saleInfo,
    connections,
    network,
  }),
  target: getSalePhaseEndpointsFx,
});

sample({
  clock: getSalePhaseEndpointsFx.doneData,
  target: $phaseEndpoints,
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

  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const saleInfo = await api.query.Broker.SaleInfo.getValue();

  return saleInfo?.sellout_price ?? null;
};

export const fetchCoresSold = async (
  network: Network,
  connections: any
): Promise<number | null> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return null;

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const saleInfo = await api.query.Broker.SaleInfo.getValue();

  return saleInfo?.cores_sold ?? null;
};

export const fetchBrokerConfig = async (
  network: Network,
  connections: any
): Promise<Configuration | null> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return null;

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const metadata = getNetworkMetadata(network);
  if (!metadata) return null;

  const api = connection.client.getTypedApi(metadata.coretimeChain);

  const config: Configuration = await api.query.Broker.Configuration.getValue();

  return config;
};

export const getCurrentPhase = (saleInfo: SaleInfo, blockNumber: number): SalePhase => {
  if (blockNumber < saleInfo.saleStart) {
    return SalePhase.Interlude;
  } else if (blockNumber < saleInfo.saleStart + saleInfo.leadinLength) {
    return SalePhase.Leadin;
  } else {
    return SalePhase.FixedPrice;
  }
};
