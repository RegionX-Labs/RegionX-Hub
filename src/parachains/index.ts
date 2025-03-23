import { $connections, Connection } from '@/api/connection';
import { ParaState } from '@/components/ParaStateCard';
import { ChainId, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { PolkadotClient } from 'polkadot-api';

type Parachain = {
  id: number;
  name: string;
  state: ParaState.ACTIVE_PARA;
  expiry: string;
  network: Network;
};

export const parachainsRequested = createEvent<Network>();

export const $parachains = createStore<Parachain[]>([]);

const fetchActiveParas = async (client: PolkadotClient, metadata: any): Promise<number[]> => {

  const workload = await (client.getTypedApi(metadata) as any).query.Broker.Workload.getEntries();
  console.log(workload);

  return [];
};

type GetParachainsPayload = {
    connections: Record<ChainId, Connection>,
    network: Network,
};

const getParachainsFx = createEffect(
  async (payload: GetParachainsPayload): Promise<Parachain[]> => {
    const networkChainIds = getNetworkChainIds(payload.network);

    if (!networkChainIds) return [];
    const connection = payload.connections[networkChainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') return [];

    const client = connection.client;
    const metadata = getNetworkMetadata(payload.network);
    if (!metadata) return [];

    fetchActiveParas(client, metadata.coretimeChain);

    return [];
  }
);

sample({
  clock: parachainsRequested,
  source: $connections,
  fn: (connections, network) => ({
    connections,
    network,
  }),
  target: getParachainsFx,
});

sample({
  clock: getParachainsFx.doneData,
  target: $parachains,
});
