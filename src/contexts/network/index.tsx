import { Network } from '@/types';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface NetworkData {
  network: Network;
  setNetwork: (_network: Network) => void;
}

const defaultNetworkData: NetworkData = {
  network: Network.ROCOCO,
  setNetwork: (_network: Network) => {
    /** */
  },
};

const NetworkDataContext = createContext<NetworkData>(defaultNetworkData);

interface Props {
  children: React.ReactNode;
}

const NetworkProvider = ({ children }: Props) => {
  const [activeNetwork, setActiveNetwork] = useState<Network>(Network.NONE);

  const router = useRouter();
  const { network } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    if (network === 'polkadot') setActiveNetwork(Network.POLKADOT);
    else if (network === 'kusama') setActiveNetwork(Network.KUSAMA);
    else if (network === 'paseo') setActiveNetwork(Network.PASEO);
    else if (network === 'rococo') setActiveNetwork(Network.ROCOCO);
    else if (network === 'westend') setActiveNetwork(Network.WESTEND);
    else {
      // invalid network param. redirect to the default chain: polkadot
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            network: 'polkadot',
          },
        },
        undefined,
        { shallow: false }
      );
    }

    console.log(network);
  }, [network, router, router.isReady]);

  const setNetwork = (network: Network) => setActiveNetwork(network);

  return (
    <NetworkDataContext.Provider value={{ network: activeNetwork, setNetwork }}>
      {children}
    </NetworkDataContext.Provider>
  );
};

const useNetwork = () => useContext(NetworkDataContext);

export { NetworkProvider, useNetwork };
