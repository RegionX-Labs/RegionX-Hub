import { $connections, Connection } from '@/api/connection';
import { ApiResponse, fetchGraphql } from '@/graphql';
import { ChainId, getNetworkChainIds, getNetworkCoretimeIndexer, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import { dot_coretime } from '@polkadot-api/descriptors';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const saleInfoRequested = createEvent<Network>();

export const $saleInfo = createStore<SaleInfo | null>(null);

type SaleInfo = {
    saleStart: string;
    endPrice: string;
    regionBegin: number;
    regionEnd: number;
    idealCoresSold: number;
    coresOffered: number; 
    firstCore: number;
    selloutPrice: string;
    coresSold: number;
};

const fetchSaleInfo = async (connections: Record<ChainId, Connection>, network: Network): Promise<SaleInfo | null> => {
  const networkChainIds = getNetworkChainIds(network);
  console.log("====> Fetching sale info <====");

  if(!networkChainIds) return null;
  const connection = connections[networkChainIds.relayChain];
  console.log(connection);
  if(!connection || !connection.client || connection.status !== "connected") return null;

  const client = connection.client;
  const saleInfo = await client.getTypedApi(dot_coretime).query.Broker.SaleInfo.getValue();
  console.log(saleInfo);
 
  return null;
};

type SaleInfoFxInput = {
    connections: Record<ChainId, Connection>,
    network: Network,
}

const getSaleInfoFx = createEffect(async (payload: SaleInfoFxInput): Promise<SaleInfo | null> => {
  const saleInfo = await fetchSaleInfo(payload.connections, payload.network);
  return saleInfo;
});

sample({
  clock: saleInfoRequested,
  source: $connections,
  fn: (connections, network): SaleInfoFxInput => ({ connections, network }),
  target: getSaleInfoFx,
});

sample({
  clock: getSaleInfoFx.doneData,
  target: $saleInfo,
});
