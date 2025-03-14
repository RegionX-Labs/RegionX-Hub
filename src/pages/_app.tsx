import '../styles/global.scss';
import '@region-x/components/dist/components.css';
import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Network } from '@/types';
import { networkStarted } from '@/api/connection';
import { getExtensions } from '@/wallet';
import { Montserrat } from "next/font/google";
import { saleInfoRequested } from '@/coretime/saleInfo';

const montserrat = Montserrat({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { network } = router.query;

  useEffect(() => {
    let _network = Network.NONE;
    if (!router.isReady) return;
    if (network === 'polkadot') _network = Network.POLKADOT;
    else if (network === 'kusama') _network = Network.KUSAMA;
    else if (network === 'paseo') _network = Network.PASEO;
    else if (network === 'rococo') _network = Network.ROCOCO;
    else if (network === 'westend') _network = Network.WESTEND;
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
    networkStarted(_network);
    getExtensions();
    saleInfoRequested(_network);
  }, [network, router, router.isReady]);

  return (
    <div className={montserrat.className}>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default App;
