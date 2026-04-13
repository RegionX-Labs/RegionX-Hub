import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const purchaseHistoryRequested = createEvent<{ network: Network; saleCycle: number }>();

export const $purchaseHistory = createStore<PurchaseHistoryItem[]>([]);
export const $totalPurchases = createStore<number>(0);

export enum PurchaseType {
  BULK = 'new core purchase',
  RENEWAL = 'renewal',
}

export type PurchaseHistoryItem = {
  address: string;
  core: number;
  extrinsicId: string;
  timestamp: Date;
  price: number;
  type: PurchaseType;
};

export type PurchaseHistoryResult = {
  items: PurchaseHistoryItem[];
  totalCount: number;
  saleCycle: number;
};

// Purchase history requires an indexer to fetch historical event data.
// Without the indexer, we return empty results.
const getPurchaseHistoryFx = createEffect(
  async (payload: { network: Network; saleCycle: number }): Promise<PurchaseHistoryResult> => {
    return { items: [], totalCount: 0, saleCycle: payload.saleCycle };
  }
);

sample({
  clock: purchaseHistoryRequested,
  target: getPurchaseHistoryFx,
});

sample({
  clock: getPurchaseHistoryFx.doneData,
  source: purchaseHistoryRequested,
  filter: (params, result) => result.saleCycle === params.saleCycle,
  fn: (_, result) => result.items,
  target: $purchaseHistory,
});

sample({
  clock: getPurchaseHistoryFx.doneData,
  fn: ({ totalCount }) => totalCount,
  target: $totalPurchases,
});
