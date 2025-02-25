import { defineConfig } from "@reactive-dot/core";
import { dot } from "@polkadot-api/descriptors";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import { MimirWalletProvider } from "@reactive-dot/wallet-mimir";
import { createLightClientProvider } from "@reactive-dot/core/providers/light-client.js";

const lightClientProvider = createLightClientProvider();

export const config = defineConfig({
    chains: {
        polkadot: {
            descriptor: dot,
            provider: lightClientProvider.addRelayChain({ id: "polkadot" }),
        },
    },
    wallets: [
        new InjectedWalletProvider(),
        new MimirWalletProvider(),
    ],
});
