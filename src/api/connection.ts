import { createEffect, createEvent, createStore, sample, scopeBind } from 'effector';
import { createClient, type PolkadotClient } from 'polkadot-api';
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { Network } from '@/types';
import { Chain, ChainId, chains, getNetworkChainIds } from '@/network';
import { RPC_SETTINGS_KEY, RpcSettings } from '@/constants/rpc';

export type Connection = {
  client?: PolkadotClient;
  status: 'connecting' | 'connected' | 'error' | 'disconnected' | 'closed';
};

export const networkStarted = createEvent<Network>();
export const initChains = createEvent();
export const chainConnected = createEvent<ChainId>();
export const chainDisconnected = createEvent<ChainId>();
export const rpcEndpointUpdated = createEvent<{ chainId: ChainId; url: string }>();

const providerStatusChanged = createEvent<{ chainId: ChainId; status: Connection['status'] }>();

const $chains = createStore<Record<ChainId, Chain>>({});
export const $connections = createStore<Record<ChainId, Connection>>({});
export const $network = createStore<Network>(Network.POLKADOT);

const loadRpcSettings = (network: Network) => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RPC_SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RpcSettings;
    return parsed?.[network] ?? null;
  } catch {
    return null;
  }
};

const getChainsFx = createEffect((network: Network): Record<ChainId, Chain> => {
  const _chains: Record<ChainId, Chain> = Object.fromEntries(
    Object.entries(chains).map(([_key, chain]) => [chain.chainId, chain])
  );

  const customRpc = loadRpcSettings(network);
  const setNode = (chainId: ChainId | undefined, url?: string) => {
    if (!chainId || !url || !_chains[chainId]) return;
    _chains[chainId] = { ..._chains[chainId], nodes: [{ url }] };
  };

  if (customRpc) {
    switch (network) {
      case Network.POLKADOT:
        setNode(chains.polkadot.chainId, customRpc.relayUrl);
        setNode(chains.polkadotCoretime.chainId, customRpc.coretimeUrl);
        break;
      case Network.KUSAMA:
        setNode(chains.kusama.chainId, customRpc.relayUrl);
        setNode(chains.kusamaCoretime.chainId, customRpc.coretimeUrl);
        break;
      case Network.PASEO:
        setNode(chains.paseo.chainId, customRpc.relayUrl);
        setNode(chains.paseoCoretime.chainId, customRpc.coretimeUrl);
        break;
      case Network.WESTEND:
        setNode(chains.westend.chainId, customRpc.relayUrl);
        setNode(chains.westendCoretime.chainId, customRpc.coretimeUrl);
        break;
      default:
        break;
    }
  }

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

    let status: Connection['status'] = 'connecting';
    const client = createClient(
      withPolkadotSdkCompat(
        getWsProvider({
          endpoints: params.nodes,
          timeout: 3500,
          onStatusChanged: (_status) => {
            switch (_status.type) {
              case 0:
                status = 'connecting';
                console.info('⚫️ Connecting to ==> ', params.name);
                break;
              case 1:
                status = 'connected';
                console.info('🟢 Provider connected ==> ', params.name);
                break;
              case 2:
                status = 'error';
                console.info('🔴 Provider error ==> ', params.name);
                break;
              case 3:
                status = 'closed';
                console.info('🟠 Provider closed ==> ', params.name);
                break;
            }
            boundStatusChange({ chainId: params.chainId, status });
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

  chainConnected(newNetworkChains.relayChain);
  chainConnected(newNetworkChains.coretimeChain);
  chainConnected(newNetworkChains.peopleChain);
  if (newNetworkChains.regionxChain) {
    chainConnected(newNetworkChains.regionxChain);
  }
  if (newNetworkChains.ahChain) {
    chainConnected(newNetworkChains.ahChain);
  }

  return network;
});

const disconnectFx = createEffect(
  async (client: PolkadotClient): Promise<{ chainId: ChainId; client: PolkadotClient }> => {
    const chainSpecData = await client.getChainSpecData();
    client.destroy();
    return { chainId: chainSpecData.genesisHash as ChainId, client };
  }
);

// Chain setup flow
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
  fn: (network) => network,
  target: initChainsFx,
});

sample({
  clock: chainDisconnected,
  source: $connections,
  filter: (connections, chainId) => connections[chainId].status !== 'disconnected',
  fn: (connections, chainId) => connections[chainId].client!,
  target: disconnectFx,
});

sample({
  clock: disconnectFx.doneData,
  source: $connections,
  fn: (connections, { chainId, client }) => {
    if (connections[chainId]?.client && connections[chainId].client !== client) {
      return connections;
    }

    return {
      ...connections,
      [chainId]: { status: 'disconnected' },
    };
  },
  target: $connections,
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
  clock: rpcEndpointUpdated,
  source: $chains,
  fn: (chains, { chainId, url }) => {
    const chain = chains[chainId];
    if (!chain) return chains;

    return {
      ...chains,
      [chainId]: {
        ...chain,
        nodes: [{ url }],
      },
    };
  },
  target: $chains,
});

sample({
  clock: rpcEndpointUpdated,
  source: $connections,
  filter: (connections, { chainId }) => Boolean(connections[chainId]?.client),
  fn: (connections, { chainId }) => connections[chainId].client!,
  target: disconnectFx,
});

sample({
  clock: rpcEndpointUpdated,
  source: $chains,
  filter: (chains, { chainId }) => Boolean(chains[chainId]),
  fn: (chains, { chainId, url }) => ({
    chainId,
    name: chains[chainId].name,
    nodes: [url],
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

sample({
  clock: providerStatusChanged,
  source: $connections,
  fn: (connections, { chainId, status }) => ({
    ...connections,
    [chainId]: { ...connections[chainId], status },
  }),
  target: $connections,
});
