export type ChainId = `0x${string}`;

type Node = {
    url: string;
}

export type Chain = {
  name: string;
  chainId: ChainId;
  nodes: Node[]; 
}

export const chains = {
    polkadotCoretime: {
        chainId: "0xefb56e30d9b4a24099f88820987d0f45fb645992416535d87650d98e00f46fc4" as ChainId,
        name: 'Polkadot Coretime',
        nodes: [ {url: "wss://coretime-polkadot.dotters.network"} ] // TODO: add more nodes
    },
    kusamaCoretime: {
        chainId: "0x638cd2b9af4b3bb54b8c1f0d22711fc89924ca93300f0caf25a580432b29d050" as ChainId,
        name: 'Kusama Coretime',
        nodes: [ {url: "wss://ksm-rpc.stakeworld.io/coretime"} ] // TODO: add more nodes
    },
    paseoCoretime: {
        chainId: "0xc806038cc1d06766f23074ade7c5511326be41646deabc259970ff280c82a464" as ChainId,
        name: 'Paseo Coretime',
        nodes: [ {url: "wss://sys.ibp.network/coretime-paseo"} ] // TODO: add more nodes
    },
    westendCoretime: {
        chainId: "0xf938510edee7c23efa6e9db74f227c827a1b518bffe92e2f6c9842dc53d38840" as ChainId,
        name: 'Westend Coretime',
        nodes: [ {url: "wss://coretime-westend.dotters.network"} ] // TODO: add more nodes
    }
}
