import { ChainId, chains } from "@/network/chains";
import { Network } from "@/types";

// Get all the relevant chain ids of a network.
//
// This will be the coretime chain, relay chain and the regionx chain.
export const getNetworkChainIds = (network: Network): ChainId[] => {
    switch(network) {
        case Network.POLKADOT: 
            return [chains.polkadotCoretime.chainId];
        case Network.KUSAMA:
            return [chains.kusamaCoretime.chainId];
        case Network.PASEO:
            return [chains.paseoCoretime.chainId];
        case Network.WESTEND:
            return [chains.westendCoretime.chainId];
        default:
            return [];
    }
}

// Returns the coretime indexer url.
export const getNetworkCoretimeIndexer = (network: Network): string => {
    switch(network) {
        case Network.POLKADOT: 
            return "https://polkadot-coretime-indexer.regionx.tech/";
        case Network.KUSAMA:
            return "https://kusama-coretime-indexer.regionx.tech/";
        case Network.PASEO:
            return "https://paseo-coretime-indexer.regionx.tech/";
        case Network.WESTEND:
            return "https://westend-coretime-indexer.regionx.tech/";
        default:
            return "";
    }
}

export * from './chains';
