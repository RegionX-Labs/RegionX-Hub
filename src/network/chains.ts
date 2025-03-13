export type ChainId = `0x${string}`;

type Node = {
  url: string;
};

export type Chain = {
  name: string;
  chainId: ChainId;
  nodes: Node[];
};

export const chains = {
  polkadot: {
    chainId: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3' as ChainId,
    name: 'Polkadot',
    nodes: [{ url: 'wss://rpc.ibp.network/polkadot' }], // TODO: add more nodes
  },
  kusama: {
    chainId: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe' as ChainId,
    name: 'Kusama',
    nodes: [{ url: 'wss://rpc.ibp.network/kusama' }], // TODO: add more nodes
  },
  paseo: {
    chainId: '0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f' as ChainId,
    name: 'Paseo',
    nodes: [{ url: 'wss://rpc.ibp.network/paseo' }], // TODO: add more nodes
  },
  westend: {
    chainId: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e' as ChainId,
    name: 'Paseo',
    nodes: [{ url: 'wss://rpc.ibp.network/westend' }], // TODO: add more nodes
  },
  polkadotCoretime: {
    chainId: '0xefb56e30d9b4a24099f88820987d0f45fb645992416535d87650d98e00f46fc4' as ChainId,
    name: 'Polkadot Coretime',
    nodes: [{ url: 'wss://coretime-polkadot.dotters.network' }], // TODO: add more nodes
  },
  kusamaCoretime: {
    chainId: '0x638cd2b9af4b3bb54b8c1f0d22711fc89924ca93300f0caf25a580432b29d050' as ChainId,
    name: 'Kusama Coretime',
    nodes: [{ url: 'wss://ksm-rpc.stakeworld.io/coretime' }], // TODO: add more nodes
  },
  paseoCoretime: {
    chainId: '0xc806038cc1d06766f23074ade7c5511326be41646deabc259970ff280c82a464' as ChainId,
    name: 'Paseo Coretime',
    nodes: [{ url: 'wss://sys.ibp.network/coretime-paseo' }], // TODO: add more nodes
  },
  westendCoretime: {
    chainId: '0xf938510edee7c23efa6e9db74f227c827a1b518bffe92e2f6c9842dc53d38840' as ChainId,
    name: 'Westend Coretime',
    nodes: [{ url: 'wss://coretime-westend.dotters.network' }], // TODO: add more nodes
  },
};
