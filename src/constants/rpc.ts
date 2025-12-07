import { Network } from '@/types';

export const RPC_SETTINGS_KEY = 'rpc_settings';

export type RpcSettings = Partial<
  Record<
    Network,
    {
      relayUrl: string;
      coretimeUrl: string;
    }
  >
>;
