import { createEffect, createEvent, createStore, sample, scopeBind } from 'effector';
import { createClient, type PolkadotClient } from 'polkadot-api';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { Network } from '@/types';
import { Chain, ChainId, chains, getNetworkChainIds } from '@/network';

// TODO: add tests like in: https://github.com/novasamatech/telenova-web-app/blob/9a6b5c2cf26426bf825d154343ac8530fdaa8406/app/models/network/network-model.test.ts

export type Connection = {
  client?: PolkadotClient;
  status: 'connecting' | 'connected' | 'error' | 'disconnected' | 'closed';
};

export const networkStarted = createEvent<Network>();
export const initChains = createEvent();
export const chainConnected = createEvent<ChainId>();
export const chainDisconnected = createEvent<ChainId>();

const providerStatusChanged = createEvent<{ chainId: ChainId; status: Connection['status'] }>();

const $chains = createStore<Record<ChainId, Chain>>({});
export const $connections = createStore<Record<ChainId, Connection>>({});
export const $network = createStore<Network>(Network.POLKADOT);

const getChainsFx = createEffect((): Record<ChainId, Chain> => {
  const _chains: Record<ChainId, Chain> = Object.fromEntries(
    Object.entries(chains).map(([_key, chain]) => [chain.chainId, chain])
  );

  return _chains;
});

type CreateClientParams = {
  name: string;
  chainId: ChainId;
  nodes: string[];
};
export const createPolkadotClientFx = createEffect(
  (params: CreateClientParams): [PolkadotClient, Connection['status']] => {
    const boundStatusChange = scopeBind(providerStatusChanged, { safe: true });

    // To support old Polkadot-SDK 1.1.0 <= x < 1.11.0
    // More => https://papi.how/requirements#polkadot-sdk-110--x--1110
    let status: Connection['status'] = 'connecting';
    const client = createClient(
      withPolkadotSdkCompat(
        getWsProvider({
          endpoints: params.nodes,
          timeout: 3500,
          onStatusChanged: (_status) => {
            switch (_status.type) {
              // Connecting
              case 0:
                status = 'connecting';
                console.info('⚫️ Connecting to ==> ', params.name);
                boundStatusChange({ chainId: params.chainId, status });
                break;
              // Connected
              case 1:
                status = 'connected';
                console.info('🟢 Provider connected ==> ', params.name);
                boundStatusChange({ chainId: params.chainId, status });
                break;
              // Error
              case 2:
                status = 'error';
                console.info('🔴 Provider error ==> ', params.name);
                boundStatusChange({ chainId: params.chainId, status });
                break;
              // Close
              case 3:
                status = 'closed';
                console.info('🟠 Provider closed ==> ', params.name);
                boundStatusChange({ chainId: params.chainId, status });
                break;
            }
          },
        })
      )
    );

    return [client, status];
  }
);

export const initChainsFx = createEffect((network: Network) => {
  const newNetworkChains = getNetworkChainIds(network);
  if (!newNetworkChains) {
    return Network.NONE;
  }

  chainConnected(newNetworkChains.coretimeChain);
  chainConnected(newNetworkChains.relayChain);

  return network;
});

const disconnectFx = createEffect(async (client: PolkadotClient): Promise<ChainId> => {
  const chainSpecData = await client.getChainSpecData();
  client.destroy();

  return chainSpecData.genesisHash as ChainId;
});

sample({
  clock: networkStarted,
  target: [$network, getChainsFx],
});

sample({
  clock: getChainsFx.doneData,
  target: $chains,
});

sample({
  clock: getChainsFx.doneData,
  fn: (chains) => {
    const connections: Record<ChainId, Connection> = {};

    for (const chainId of Object.keys(chains)) {
      connections[chainId as ChainId] = { status: 'disconnected' };
    }
    return connections;
  },
  target: $connections,
});

sample({
  clock: getChainsFx.done,
  target: initChains,
});

sample({
  clock: initChains,
  source: $network,
  fn: (network: Network) => {
    return network;
  },
  target: initChainsFx,
});

sample({
  clock: chainDisconnected,
  source: $connections,
  filter: (connections, chainId) => {
    return connections[chainId].status !== 'disconnected';
  },
  fn: (connections, chainId) => {
    return connections[chainId].client!;
  },
  target: disconnectFx,
});

sample({
  clock: chainConnected,
  source: $chains,
  fn: (chains, chainId) => ({
    chainId,
    name: chains[chainId].name,
    nodes: chains[chainId].nodes.map((node) => node.url),
  }),
  target: createPolkadotClientFx,
});

sample({
  clock: createPolkadotClientFx.done,
  source: $connections,
  fn: (connections, { result, params }) => ({
    ...connections,
    [params.chainId]: { client: result[0], status: result[1] },
  }),
  target: $connections,
});
