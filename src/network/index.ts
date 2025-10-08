import { ChainId, chains } from '@/network/chains';
import { Network } from '@/types';
import {
  dot,
  dot_coretime,
  ksm,
  ksm_coretime,
  pas,
  pas_coretime,
  rx_ksm,
  wnd,
  wnd_coretime,
  dot_people,
  ksm_people,
  wnd_people,
  pas_people,
  ksm_ah,
} from '@polkadot-api/descriptors';

export type NetworkChainIds = {
  relayChain: ChainId;
  coretimeChain: ChainId;
  ahChain?: ChainId;
  regionxChain: ChainId | null;
  peopleChain: ChainId;
};

export type RelayMetadata = typeof dot | typeof ksm | typeof pas | typeof wnd;
export type AhMetadata = typeof ksm_ah;
export type CoretimeMetadata =
  | typeof dot_coretime
  | typeof ksm_coretime
  | typeof pas_coretime
  | typeof wnd_coretime;

export type RegionXMetadata = typeof rx_ksm;
export type PeopleMetadata =
  | typeof dot_people
  | typeof ksm_people
  | typeof wnd_people
  | typeof pas_people;

export type NetworkMetadata = {
  relayChain: RelayMetadata;
  coretimeChain: CoretimeMetadata;
  ahChain?: AhMetadata;
  regionxChain: RegionXMetadata | null;
  peopleChain: PeopleMetadata;
};

// Get all the relevant chain ids of a network.
//
// This will be the coretime chain, relay chain and the regionx chain.
export const getNetworkChainIds = (network: Network): NetworkChainIds | null => {
  switch (network) {
    case Network.POLKADOT:
      return {
        relayChain: chains.polkadot.chainId,
        coretimeChain: chains.polkadotCoretime.chainId,
        regionxChain: null,
        peopleChain: chains.polkadotPeople.chainId,
      };
    case Network.KUSAMA:
      return {
        relayChain: chains.kusama.chainId,
        coretimeChain: chains.kusamaCoretime.chainId,
        ahChain: chains.kusamaAH.chainId,
        regionxChain: chains.regionxKusama.chainId,
        peopleChain: chains.peopleKusama.chainId,
      };
    case Network.PASEO:
      return {
        relayChain: chains.paseo.chainId,
        coretimeChain: chains.paseoCoretime.chainId,
        regionxChain: null,
        peopleChain: chains.peoplePaseo.chainId,
      };
    case Network.WESTEND:
      return {
        relayChain: chains.westend.chainId,
        coretimeChain: chains.westendCoretime.chainId,
        regionxChain: null,
        peopleChain: chains.peopleWestend.chainId,
      };
    default:
      return null;
  }
};

// Returns the coretime indexer url.
export const getNetworkCoretimeIndexer = (network: Network): string => {
  switch (network) {
    case Network.POLKADOT:
      return 'https://polkadot-coretime-indexer.regionx.tech/';
    case Network.KUSAMA:
      return 'https://kusama-coretime-indexer.regionx.tech/';
    case Network.PASEO:
      return 'https://paseo-coretime-indexer.regionx.tech/';
    case Network.WESTEND:
      return 'https://westend-coretime-indexer.regionx.tech/';
    default:
      return '';
  }
};

export const getNetworkMetadata = (network: Network): NetworkMetadata | null => {
  switch (network) {
    case Network.POLKADOT:
      return {
        relayChain: dot,
        coretimeChain: dot_coretime,
        regionxChain: null,
        peopleChain: dot_people,
      };
    case Network.KUSAMA:
      return {
        relayChain: ksm,
        coretimeChain: ksm_coretime,
        ahChain: ksm_ah,
        regionxChain: rx_ksm,
        peopleChain: ksm_people,
      };
    case Network.PASEO:
      return {
        relayChain: pas,
        coretimeChain: pas_coretime,
        regionxChain: null,
        peopleChain: pas_people,
      };
    case Network.WESTEND:
      return {
        relayChain: wnd,
        coretimeChain: wnd_coretime,
        regionxChain: null,
        peopleChain: wnd_people,
      };
    default:
      return null;
  }
};

export * from './chains';
