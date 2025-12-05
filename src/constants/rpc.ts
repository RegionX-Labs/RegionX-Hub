import { Network } from '@/types';

export const RPC_SETTINGS_KEY = 'rpc_settings';

export type RpcSettings = Partial<
  Record<
    Network,
    {
      assetHubUrl?: string;
      // relayUrl is kept for backward compatibility with previously saved settings.
      relayUrl?: string;
      coretimeUrl: string;
    }
  >
>;
