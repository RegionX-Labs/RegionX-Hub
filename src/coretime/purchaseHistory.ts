import { ApiResponse, fetchGraphql } from "@/graphql";
import { getNetworkCoretimeIndexer } from "@/network";
import { Network } from "@/types";
import { createEffect, createEvent, createStore, sample } from "effector";

type HistoryRequestPayload = {network: Network, saleCycle: number}
export const purchaseHistoryRequested = createEvent<HistoryRequestPayload>();

export const $purchaseHistory = createStore<PurchaseHistory>([]);

export enum PurchaseType {
  BULK = 'bulk',
  RENEWAL = 'renewal',
};

export type PurchaseHistoryItem = {
  address: string;
  core: number;
  extrinsicId: string;
  timestamp: Date;
  price: number;
  type: PurchaseType;
};

type PurchaseHistory = PurchaseHistoryItem[];

export const fetchPurchaseHistory = async (
  network: Network, 
  saleCycle: number, 
  orderBy = 'HEIGHT_DESC'
): Promise<ApiResponse> => {
  const query = `{
    purchases(
      filter: {saleCycle: {equalTo: ${saleCycle}}}
      orderBy: ${orderBy}
    ) {
      nodes {
        account
        core
        extrinsicId
        height
        price
        purchaseType
        timestamp
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }`;
  return fetchGraphql(getNetworkCoretimeIndexer(network), query);
};

const getPurchaseHistoryFx = createEffect(async(payload: HistoryRequestPayload): Promise<PurchaseHistory> => {
    const res: ApiResponse = await fetchPurchaseHistory(payload.network, payload.saleCycle);
    const { status, data } = res;
    if (status !== 200) return [];

    const history = (data.purchases.nodes as Array<any>).map(
        ({ account, core, extrinsicId, height, price, purchaseType, timestamp }) =>
          ({
            address: account,
            core,
            extrinsicId: `${height}-${extrinsicId}`,
            timestamp: new Date(Number(timestamp)),
            price: parseInt(price),
            type: purchaseType,
          }) as PurchaseHistoryItem
      )

    return history;
});

sample({
  clock: purchaseHistoryRequested,
  target:getPurchaseHistoryFx 
});

sample({
  clock: getPurchaseHistoryFx.doneData,
  target: $purchaseHistory
});
