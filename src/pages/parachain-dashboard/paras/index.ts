export enum ParaState {
  RESERVED,
  ONBOARDING,
  ONDEMAND_PARACHAIN,
  IDLE_PARA,
  ACTIVE_PARA,
  ACTIVE_RENEWABLE_PARA,
  IN_WORKPLAN,
  LEASE_HOLDING,
  SYSTEM,
}
export type ParachainInfo = {
  id: number;
  core: number;
  state: ParaState;
  name: string;
  watching?: boolean;
  logo?: string;
  homepage?: string;
};

export type LeaseState = {
  paraId: number;
  until: number;
};

export type BrokerStatus = {
  coreCount: number;
  privatePoolSize: number;
  systemPoolSize: number;
  lastCommittedTimeslice: number;
  lastTimeslice: number;
};
