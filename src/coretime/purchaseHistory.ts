import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { subscanFetch } from '@/subscan';

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

type SubscanExtrinsic = {
  extrinsic_index: string;
  block_num: number;
  block_timestamp: number;
  account_id: string;
  call_module: string;
  call_module_function: string;
  success: boolean;
  fee: string;
  params: string | { name: string; value: unknown }[];
};

const parseExtrinsicParams = (
  params: SubscanExtrinsic['params']
): { name: string; value: unknown }[] => {
  if (!params) return [];
  try {
    return typeof params === 'string' ? JSON.parse(params) : params;
  } catch {
    return [];
  }
};

const parseAmount = (value: unknown): number => {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'bigint') return 0;
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

// Fetch purchase history from Subscan using the extrinsics endpoint.
// We query for broker.purchase and broker.renew extrinsics.
const getPurchaseHistoryFx = createEffect(
  async (payload: { network: Network; saleCycle: number }): Promise<PurchaseHistoryResult> => {
    // Fetch purchase and renewal extrinsics sequentially to respect rate limits.
    const purchaseData = await subscanFetch<any>(payload.network, '/api/v2/scan/extrinsics', {
      module: 'broker',
      call: 'purchase',
      row: 100,
      page: 0,
    });
    const renewalData = await subscanFetch<any>(payload.network, '/api/v2/scan/extrinsics', {
      module: 'broker',
      call: 'renew',
      row: 100,
      page: 0,
    });

    const mapExtrinsic = (ex: SubscanExtrinsic, type: PurchaseType): PurchaseHistoryItem | null => {
      if (!ex.success) return null;

      const params = parseExtrinsicParams(ex.params);
      const priceParam = params.find((p) => ['price_limit', 'max_amount'].includes(p.name));
      const price = parseAmount(priceParam?.value);

      return {
        address: ex.account_id || '',
        core: 0,
        extrinsicId: ex.extrinsic_index || '',
        timestamp: new Date(ex.block_timestamp * 1000),
        // The transaction fee is not sale revenue. For purchases, Subscan exposes
        // the submitted amount as price_limit/max_amount in the call parameters.
        price,
        type,
      };
    };

    const purchases = (purchaseData?.extrinsics || [])
      .map((ex: SubscanExtrinsic) => mapExtrinsic(ex, PurchaseType.BULK))
      .filter(Boolean) as PurchaseHistoryItem[];

    const renewals = (renewalData?.extrinsics || [])
      .map((ex: SubscanExtrinsic) => mapExtrinsic(ex, PurchaseType.RENEWAL))
      .filter(Boolean) as PurchaseHistoryItem[];

    const items = [...purchases, ...renewals].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return {
      items,
      totalCount: items.length,
      saleCycle: payload.saleCycle,
    };
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
