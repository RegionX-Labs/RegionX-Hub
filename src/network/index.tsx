import { ChainId, chains } from "@/api/chains";
import { chainConnected, chainDisconnected } from "@/api/connection";
import { Network } from "@/types";
import { createEffect, createEvent, createStore, sample } from "effector";

export const $network = createStore<Network>(Network.POLKADOT);

export const networkStarted = createEvent<Network>(Network.POLKADOT);

export const networkStartedFx = createEffect<{
  oldNetwork: Network;
  newNetwork: Network;
}, Network>((payload) => {
    const currentNetworkChains = getNetworkChainIds(payload.oldNetwork);
    const newNetworkChains = getNetworkChainIds(payload.newNetwork);
    currentNetworkChains.forEach(chainId => {
        chainDisconnected(chainId);
    });
    newNetworkChains.forEach(chainId => {
        chainConnected(chainId);
    });

    return payload.newNetwork;
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
    clock: networkStarted,
    source: $network,
    fn: (oldNetwork, newNetwork) => ({
        oldNetwork,
        newNetwork,
    }),
    target: networkStartedFx,
});
