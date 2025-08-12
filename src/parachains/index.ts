import { $connections, Connection } from '@/api/connection';
import { ParaState } from '@/components/ParaStateCard';
import { ChainId, CoretimeMetadata, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { PolkadotClient } from 'polkadot-api';

type Parachain = {
  id: number;
  state: ParaState;
  network: Network;
};

export const parachainsRequested = createEvent<Network>();

export const $parachains = createStore<Parachain[]>([]);

type GetParachainsPayload = {
  connections: Record<ChainId, Connection>;
  network: Network;
};

const getParachainsFx = createEffect(
  async (payload: GetParachainsPayload): Promise<Parachain[]> => {
    const networkChainIds = getNetworkChainIds(payload.network);

    if (!networkChainIds) return [];
    const connection = payload.connections[networkChainIds.relayChain];
    if (!connection || !connection.client || connection.status !== 'connected') return [];

    const client = connection.client;
    const metadata = getNetworkMetadata(payload.network);
    if (!metadata) return [];
    const typedApi = client.getTypedApi(metadata.relayChain);

    const parachains: Parachain[] = (await typedApi.query.Registrar.Paras.getEntries())
      .sort((_e1, _e2) => _e1.keyArgs[0] - _e2.keyArgs[0])
      .map((entry) => {
        let state = ParaState.ACTIVE_PARA;

        if (entry.keyArgs[0] < 2000) state = ParaState.SYSTEM;
        if (entry.value.locked === undefined) state = ParaState.RESERVED;
        if (entry.value.locked === false) state = ParaState.GENESIS;

        return {
          id: entry.keyArgs[0],
          state,
          network: payload.network,
        };
      });

    return parachains;
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
