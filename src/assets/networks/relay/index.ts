import { Network } from '@/types';

import Kusama from './kusama.png';
import Paseo from './paseo.png';
import Polkadot from './polkadot.png';
import Rococo from './rococo.png';
import Westend from './westend.png';
import KusamaCoretime from '../coretime/kusamaCoretime.png';
import PaseoCoretime from '../coretime/paseoCoretime.png';
import PolkadotCoretime from '../coretime/polkadotCoretime.png';
import WestendCoretime from '../coretime/westendCoretime.png';

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

// TODO: resize all images to 96x96

export { getRelayIcon, Kusama, Paseo, Polkadot, Rococo, Westend };
export { default as polkadotIcon } from '../wallets/polkadotjs.png';
export { default as subwalletIcon } from '../wallets/subwallet.png';
export { default as talismanIcon } from '../wallets/talisman.png';
export { default as novaIcon } from '../wallets/nova.png';

//Coretime

export { KusamaCoretime, PaseoCoretime, PolkadotCoretime, WestendCoretime };
