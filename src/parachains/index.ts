import { $connections, Connection } from '@/api/connection';
import { ParaState } from '@/components/ParaStateCard';
import { ChainId, getNetworkChainIds, getNetworkMetadata } from '@/network';
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

const fetchActiveParas = async (client: PolkadotClient, metadata: any): Promise<number[]> => {
  const workload = await (client.getTypedApi(metadata) as any).query.Broker.Workload.getEntries();
  const activeParas: number[] = [];
  for (const { value } of workload) {
    const assignments = value
      .filter((v: any) => v.assignment.type === 'Task')
      .map((v: any) => v.assignment.value);

    activeParas.push(...assignments);
  }

  return activeParas;
};

const fetchLeaseHoldingParas = async (client: PolkadotClient, metadata: any): Promise<number[]> => {
  const leases = await (client.getTypedApi(metadata) as any).query.Broker.Leases.getValue();
  const paraIds = (leases as Array<{ until: number; task: number }>).map((lease) => lease.task);
  return paraIds;
};

const fetchWorkplanParas = async (client: PolkadotClient, metadata: any): Promise<number[]> => {
  const workplan = await (client.getTypedApi(metadata) as any).query.Broker.Workplan.getEntries();
  const workplanParas: number[] = [];

  for (const { value } of workplan) {
    const assignments = value
      .filter((v: any) => v.assignment.type === 'Task')
      .map((v: any) => v.assignment.value);

    workplanParas.push(...assignments);
  }

  return workplanParas;
};

const fetchSystemParas = async (client: PolkadotClient, metadata: any): Promise<number[]> => {
  const reservations = await (
    client.getTypedApi(metadata) as any
  ).query.Broker.Reservations.getValue();

  const systemParas: number[] = [];
  for (const value of reservations) {
    const assignments = value
      .filter((v: any) => v.assignment.type === 'Task')
      .map((v: any) => v.assignment.value);

    systemParas.push(...assignments);
  }

  return systemParas;
};

type GetParachainsPayload = {
  connections: Record<ChainId, Connection>;
  network: Network;
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

    const activeParas = await fetchActiveParas(client, metadata.coretimeChain);
    const leaseHoldingParas = await fetchLeaseHoldingParas(client, metadata.coretimeChain);
    const workplanParas = await fetchWorkplanParas(client, metadata.coretimeChain);
    const systemParas = await fetchSystemParas(client, metadata.coretimeChain);

    const parachains: Parachain[] = Array.from(
      new Set([...activeParas, ...leaseHoldingParas, ...workplanParas, ...systemParas])
    )
      .sort((_p1, _p2) => _p1 - _p2)
      .map((p) => ({
        id: p,
        network: payload.network,
        state: systemParas.find((_p) => _p === p)
          ? ParaState.SYSTEM
          : leaseHoldingParas.find((_p) => _p === p)
            ? ParaState.LEASE_HOLDING
            : activeParas.find((_p) => _p === p)
              ? ParaState.ACTIVE_PARA
              : ParaState.IN_WORKPLAN,
      }));

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
