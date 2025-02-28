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

export * from './chains';
