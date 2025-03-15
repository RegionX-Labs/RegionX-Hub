import { Connection } from '@/api/connection';
import { ChainId, getNetworkChainIds } from '@/network';
import { Network } from '@/types';
import { dot_coretime } from '@polkadot-api/descriptors';
import { createEffect, createEvent, createStore, sample } from 'effector';

type SaleInfoRequestPayload = {
  connections: Record<ChainId, Connection>;
  network: Network;
};

export const saleInfoRequested = createEvent<SaleInfoRequestPayload>();

export const $saleInfo = createStore<SaleInfo | null>(null);

type SaleInfo = {
  sale_start: number;
  leadin_length: number;
  end_price: bigint;
  region_begin: number;
  region_end: number;
  ideal_cores_sold: number;
  cores_offered: number;
  first_core: number;
  sellout_price: bigint | undefined;
  cores_sold: number;
};

const fetchSaleInfo = async (
  connections: Record<ChainId, Connection>,
  network: Network
): Promise<SaleInfo | null> => {
  const networkChainIds = getNetworkChainIds(network);
  console.log('====> Fetching sale info <====');

  if (!networkChainIds) return null;
  const connection = connections[networkChainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return null;

  const client = connection.client;
  const saleInfo: SaleInfo | undefined = await client
    .getTypedApi(dot_coretime)
    .query.Broker.SaleInfo.getValue();
  console.log(saleInfo);

  return saleInfo || null;
};

const getSaleInfoFx = createEffect(
  async (payload: SaleInfoRequestPayload): Promise<SaleInfo | null> => {
    const saleInfo = await fetchSaleInfo(payload.connections, payload.network);
    return saleInfo;
  }
);

sample({
  clock: saleInfoRequested,
  target: getSaleInfoFx,
});

sample({
  clock: getSaleInfoFx.doneData,
  target: $saleInfo,
});
