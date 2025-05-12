import { Network } from '@/types';

import Kusama from './kusama.png';
import Paseo from './paseo.png';
import Polkadot from './polkadot.png';
import Rococo from './rococo.png';
import Westend from './westend.png';

const getRelayIcon = (network: Network) => {
  switch (network) {
    case Network.POLKADOT:
      return Polkadot;
    case Network.KUSAMA:
      return Kusama;
    case Network.PASEO:
      return Paseo;
    case Network.ROCOCO:
      return Rococo;
    case Network.WESTEND:
      return Westend;
    default:
      return Polkadot;
  }
};

export { getRelayIcon, Kusama, Paseo, Polkadot, Rococo, Westend };
