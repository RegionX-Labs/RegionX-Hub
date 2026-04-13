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
      const priceParam = params.find((p) =>
        ['price_limit', 'max_amount', 'value'].includes(p.name)
      );

      return {
        address: ex.account_id || '',
        core: 0,
        extrinsicId: ex.extrinsic_index || '',
        timestamp: new Date(ex.block_timestamp * 1000),
        price: parseInt(ex.fee || String(priceParam?.value) || '0'),
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
