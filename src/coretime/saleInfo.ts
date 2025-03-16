import { Connection } from '@/api/connection';
import { ApiResponse, fetchGraphql } from '@/graphql';
import { ChainId, getNetworkChainIds, getNetworkCoretimeIndexer } from '@/network';
import { Network } from '@/types';
import { dot_coretime } from '@polkadot-api/descriptors';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const saleInfoRequested = createEvent<Network>();

export const $saleInfo = createStore<SaleInfo | null>(null);

type SaleInfo = {
  saleCycle: number;
  saleStart: number;
  leadinLength: number;
  endPrice: string;
  regionBegin: number;
  regionEnd: number;
  idealCoresSold: number;
  coresOffered: number;
  startPrice: string;
  // TODO: missing some of the fields.
};

const fetchSaleInfo = async (
  network: Network
): Promise<ApiResponse> => {
  console.log('====> Fetching sale info <====');
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

const getSaleInfoFx = createEffect(
  async (network: Network): Promise<SaleInfo | null> => {
    const res = await fetchSaleInfo(network);
    const { status, data } = res;
    if (status !== 200) return null;

    const saleInfo: SaleInfo = data.sales.nodes[0];
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
