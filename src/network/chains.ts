export * from './chains';
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
    nodes: [
      { url: 'wss://rpc.ibp.network/polkadot' },
      { url: 'wss://polkadot-rpc.dwellir.com' },
      { url: 'wss://polkadot.api.onfinality.io/public-ws' },
      { url: 'wss://rpc.polkadot.luckyfriday.io' },
    ],
  },
  kusama: {
    chainId: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe' as ChainId,
    name: 'Kusama',
    nodes: [
      { url: 'wss://rpc.ibp.network/kusama' },
      { url: 'wss://kusama-rpc.dwellir.com' },
      { url: 'wss://kusama.api.onfinality.io/public-ws' },
      { url: 'wss://rpc.kusama.luckyfriday.io' },
    ],
  },
  paseo: {
    chainId: '0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f' as ChainId,
    name: 'Paseo',
    nodes: [
      { url: 'wss://rpc.ibp.network/paseo' },
      { url: 'wss://paseo-rpc.dwellir.com' },
      { url: 'wss://paseo.rpc.amforc.com' },
      { url: 'wss://paseo.dotters.network' },
    ],
  },
  westend: {
    chainId: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e' as ChainId,
    name: 'Westend',
    nodes: [
      { url: 'wss://rpc.ibp.network/westend' },
      { url: 'wss://westend-rpc.dwellir.com' },
      { url: 'wss://westend.api.onfinality.io/public-ws' },
      { url: 'wss://westend-rpc.polkadot.io' },
    ],
  },
  polkadotAH: {
    chainId: '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f' as ChainId,
    name: 'Polkadot AssetHub',
    nodes: [
      { url: 'wss://sys.ibp.network/asset-hub-polkadot' },
      { url: 'wss://statemint.api.onfinality.io/public-wst' },
    ],
  },
  polkadotCoretime: {
    chainId: '0xefb56e30d9b4a24099f88820987d0f45fb645992416535d87650d98e00f46fc4' as ChainId,
    name: 'Polkadot Coretime',
    nodes: [
      { url: 'wss://coretime-polkadot.dotters.network' },
      { url: 'wss://sys.ibp.network/coretime-polkadot' },
    ],
  },
  kusamaAH: {
    chainId: '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a' as ChainId,
    name: 'Kusama AssetHub',
    nodes: [
      { url: 'wss://sys.ibp.network/asset-hub-kusama' },
      { url: 'wss://kusama-asset-hub-rpc.polkadot.io' },
    ],
  },
  kusamaCoretime: {
    chainId: '0x638cd2b9af4b3bb54b8c1f0d22711fc89924ca93300f0caf25a580432b29d050' as ChainId,
    name: 'Kusama Coretime',
    nodes: [
      { url: 'wss://ksm-rpc.stakeworld.io/coretime' },
      { url: 'wss://sys.ibp.network/coretime-kusama' },
    ],
  },
  paseoAH: {
    chainId: '0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2' as ChainId,
    name: 'Paseo AssetHub',
    nodes: [
      { url: 'wss://sys.ibp.network/asset-hub-paseo' },
      { url: 'wss://pas-rpc.stakeworld.io/assethub' },
    ],
  },
  paseoCoretime: {
    chainId: '0xc806038cc1d06766f23074ade7c5511326be41646deabc259970ff280c82a464' as ChainId,
    name: 'Paseo Coretime',
    nodes: [
      { url: 'wss://sys.ibp.network/coretime-paseo' },
      { url: 'wss://paseo-coretime.paranodes.io' },
    ],
  },
  westendCoretime: {
    chainId: '0xf938510edee7c23efa6e9db74f227c827a1b518bffe92e2f6c9842dc53d38840' as ChainId,
    name: 'Westend Coretime',
    nodes: [
      { url: 'wss://coretime-westend.dotters.network' },
      { url: 'wss://sys.ibp.network/coretime-westend' },
    ],
  },
  regionxKusama: {
    chainId: '0x086319b29662e34a4f7a3de034afe64c93e3ed477e3aed3ab3ef6e31d33bc179' as ChainId,
    name: 'RegionX Kusama',
    nodes: [{ url: 'wss://regionx-kusama-rpc-lb.zeeve.net/ld940yl9c6/rpc' }],
  },
  polkadotPeople: {
    chainId: '0x67fa177a097bfa18f77ea95ab56e9bcdfeb0e5b8a40e46298bb93e16b6fc5008' as ChainId,
    name: 'People Polkadot',
    nodes: [
      { url: 'wss://sys.ibp.network/people-polkadot' },
      { url: 'wss://people-polkadot.dotters.network' },
    ],
  },
  peopleKusama: {
    chainId: '0xc1af4cb4eb3918e5db15086c0cc5ec17fb334f728b7c65dd44bfe1e174ff8b3f' as ChainId,
    name: 'People Kusama',
    nodes: [
      { url: 'wss://sys.ibp.network/people-kusama' },
      { url: 'wss://people-kusama.dotters.network' },
    ],
  },
  peopleWestend: {
    chainId: '0x1eb6fb0ba5187434de017a70cb84d4f47142df1d571d0ef9e7e1407f2b80b93c' as ChainId,
    name: 'People Westend',
    nodes: [{ url: 'wss://sys.ibp.network/people-westend' }],
  },
  peoplePaseo: {
    chainId: '0xe6c30d6e148f250b887105237bcaa5cb9f16dd203bf7b5b9d4f1da7387cb86ec' as ChainId,
    name: 'People Paseo',
    nodes: [{ url: 'wss://sys.ibp.network/people-paseo' }],
  },
};
