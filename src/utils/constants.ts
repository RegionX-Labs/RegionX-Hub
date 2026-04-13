import { FixedSizeBinary } from 'polkadot-api';

export const TIMESLICE_PERIOD = 80;
export const RELAY_CHAIN_BLOCK_TIME = 6000;
export const ASSET_HUB_PARA_ID = 1000;
export const CORETIME_PARA_ID = 1005;

export const REGIONX_KUSAMA_PARA_ID = 3422;

export type RegionId = {
  begin: number;
  core: number;
  mask: FixedSizeBinary<10>;
};

export const SOLD_OUT_MESSAGE =
  'Sold out — no additional purchases or renewals are available this sale cycle.';
