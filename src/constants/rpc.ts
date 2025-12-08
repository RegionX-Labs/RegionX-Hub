import { Network } from '@/types';

export const RPC_SETTINGS_KEY = 'rpc_settings';

export type RpcSettings = Partial<
  Record<
    Network,
    {
      coretimeUrl: string;
      assetHubUrl?: string;
      // Deprecated: kept for backward compatibility with previously saved relay RPC values.
      relayUrl?: string;
    }
  >
>;
