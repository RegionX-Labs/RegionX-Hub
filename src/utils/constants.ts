import { FixedSizeBinary } from 'polkadot-api';

export const TIMESLICE_PERIOD = 80;
export const RELAY_CHAIN_BLOCK_TIME = 6000;
export const CORETIME_PARA_ID = 1005;

export const REGIONX_KUSAMA_PARA_ID = 3422;

export type RegionId = {
  begin: number;
  core: number;
  mask: FixedSizeBinary<10>;
};

export const KUSAMA_SALE_CYCLE_WITH_UPDATE = 18;
export const POLKADOT_SALE_CYCLE_WITH_UPDATE = 12;
