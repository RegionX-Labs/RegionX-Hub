import { ChainId, chains } from '@/network/chains';
import { Network } from '@/types';
import {
  dot,
  dot_coretime,
  ksm,
  ksm_coretime,
  pas,
  pas_coretime,
  wnd,
  wnd_coretime,
} from '@polkadot-api/descriptors';

type NetworkChainIds = {
  relayChain: ChainId;
  coretimeChain: ChainId;
};

type NetworkMetadata = {
  relayChain: any;
  coretimeChain: any;
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
      };
    case Network.KUSAMA:
      return {
        relayChain: chains.kusama.chainId,
        coretimeChain: chains.kusamaCoretime.chainId,
      };
    case Network.PASEO:
      return {
        relayChain: chains.paseo.chainId,
        coretimeChain: chains.paseoCoretime.chainId,
      };
    case Network.WESTEND:
      return {
        relayChain: chains.westend.chainId,
        coretimeChain: chains.westendCoretime.chainId,
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
      };
    case Network.KUSAMA:
      return {
        relayChain: ksm,
        coretimeChain: ksm_coretime,
      };
    case Network.PASEO:
      return {
        relayChain: pas,
        coretimeChain: pas_coretime,
      };
    case Network.WESTEND:
      return {
        relayChain: wnd,
        coretimeChain: wnd_coretime,
      };
    default:
      return null;
  }
};

export * from './chains';
