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
} from '@polkadot-api/descriptors';

type NetworkChainIds = {
  relayChain: ChainId;
  coretimeChain: ChainId;
  regionxChain: ChainId;
};

export type RelayMetadata = typeof dot | typeof ksm | typeof pas | typeof wnd;
export type CoretimeMetadata =
  | typeof dot_coretime
  | typeof ksm_coretime
  | typeof pas_coretime
  | typeof wnd_coretime;

export type RegionXMetadata = typeof rx_ksm;

export type NetworkMetadata = {
  relayChain: RelayMetadata;
  coretimeChain: CoretimeMetadata;
  regionxChain: RegionXMetadata;
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
        regionxChain: chains.regionxKusama.chainId, // TODO
      };
    case Network.KUSAMA:
      return {
        relayChain: chains.kusama.chainId,
        coretimeChain: chains.kusamaCoretime.chainId,
        regionxChain: chains.regionxKusama.chainId,
      };
    case Network.PASEO:
      return {
        relayChain: chains.paseo.chainId,
        coretimeChain: chains.paseoCoretime.chainId,
        regionxChain: chains.regionxKusama.chainId, // TODO
      };
    case Network.WESTEND:
      return {
        relayChain: chains.westend.chainId,
        coretimeChain: chains.westendCoretime.chainId,
        regionxChain: chains.regionxKusama.chainId, // TODO
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
        regionxChain: rx_ksm, // TODO
      };
    case Network.KUSAMA:
      return {
        relayChain: ksm,
        coretimeChain: ksm_coretime,
        regionxChain: rx_ksm,
      };
    case Network.PASEO:
      return {
        relayChain: pas,
        coretimeChain: pas_coretime,
        regionxChain: rx_ksm, // TODO
      };
    case Network.WESTEND:
      return {
        relayChain: wnd,
        coretimeChain: wnd_coretime,
        regionxChain: rx_ksm, // TODO
      };
    default:
      return null;
  }
};

export * from './chains';
