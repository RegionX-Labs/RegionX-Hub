import { Connection } from '@/api/connection';
import { ChainId, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { blockToTimestamp, RELAY_CHAIN_BLOCK_TIME, TIMESLICE_PERIOD } from '@/utils';
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
};

export const latestSaleRequested = createEvent<Network>();

export const $latestSaleInfo = createStore<SaleInfo | null>(null);
export const $phaseEndpoints = createStore<PhaseEndpoints | null>(null);

type GetLatestSalePayload = {
  network: Network;
  connections: Record<ChainId, Connection>;
};

const getLatestSaleInfoFx = createEffect(
  async ({ network, connections }: GetLatestSalePayload): Promise<SaleInfo | null> => {
    const chainIds = getNetworkChainIds(network);
    if (!chainIds) return null;

    const connection = connections[chainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') return null;

    const metadata = getNetworkMetadata(network);
    if (!metadata) return null;

    const api = connection.client.getTypedApi(metadata.coretimeChain);

    const [chainSaleInfo, config] = await Promise.all([
      api.query.Broker.SaleInfo.getValue(),
      api.query.Broker.Configuration.getValue() as Promise<Configuration>,
    ]);

    if (!chainSaleInfo) return null;

    const endPrice = chainSaleInfo.end_price.toString();
    // The leadin starts at 100x endPrice (leadinFactorAt(0) = 100).
    const startPrice = (chainSaleInfo.end_price * BigInt(100)).toString();

    const regionLength = chainSaleInfo.region_end - chainSaleInfo.region_begin;
    // Derive sale cycle from region boundaries. Not an exact match to the
    // indexer's sequential counter, but sufficient for the UI.
    const saleCycle = regionLength > 0 ? Math.floor(chainSaleInfo.region_begin / regionLength) : 0;

    return {
      network,
      saleCycle,
      saleStart: chainSaleInfo.sale_start,
      leadinLength: chainSaleInfo.leadin_length,
      endPrice,
      regionBegin: chainSaleInfo.region_begin,
      regionEnd: chainSaleInfo.region_end,
      idealCoresSold: chainSaleInfo.ideal_cores_sold,
      coresOffered: chainSaleInfo.cores_offered,
      startPrice,
    };
  }
);

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

    const blockTime = RELAY_CHAIN_BLOCK_TIME;

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
  source: $connections,
  fn: (connections, network) => ({ network, connections }),
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

// Sale history requires an indexer to fetch historical data.
// Without the indexer, we return an empty array.
const fetchAllSalesFx = createEffect(async (_network: Network): Promise<SaleInfo[]> => {
  return [];
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
