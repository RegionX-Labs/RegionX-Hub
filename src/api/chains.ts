export type ChainId = `0x${string}`;

export type Chain = {
  name: string;
  chainId: ChainId;
  nodes: string[];
}

type Chains = { [key: string]: Chain; };

export const chains = {
    polkadotCoretime: {
        chainId: "0xefb56e30d9b4a24099f88820987d0f45fb645992416535d87650d98e00f46fc4" as ChainId,
        name: 'Polkadot Coretime',
        nodes: ["wss://coretime-polkadot.dotters.network"]
    }
}
