import { ChainId, chains } from "@/api/chains";
import { chainConnected, chainDisconnected, chainsInitialized, networkStarted } from "@/api/connection";
import { Network } from "@/types";
import { createEffect, createStore, sample } from "effector";

const $network = createStore<Network>(Network.POLKADOT);

export const networkStartedFx = createEffect((_network: Network): Network => {
    const currentNetworkChains = getNetworkChainIds($network.getState());
    const newNetworkChains = getNetworkChainIds(_network);
    console.log(newNetworkChains);
    currentNetworkChains.forEach(chainId => {
        chainDisconnected(chainId);
    });
    newNetworkChains.forEach(chainId => {
        chainConnected(chainId);
    });

    return _network;
});

// Get all the relevant chain ids of a network.
//
// This will be the coretime chain, relay chain and the regionx chain.
const getNetworkChainIds = (network: Network): ChainId[] => {
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

sample({
    clock: chainsInitialized,
    source: $network,
    target: networkStartedFx,
});
