import '../styles/global.scss';
import '@region-x/components/dist/style.css';
import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Network } from '@/types';
import { networkStarted } from '@/api/connection';
import { getExtensions, SELECTED_WALLET_KEY, walletSelected } from '@/wallet';
import { Montserrat } from 'next/font/google';
import RpcSettingsModal from '@/components/RpcSettingsModal';
import Image from 'next/image';

const montserrat = Montserrat({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { network } = router.query;

  const [isRpcModalOpen, setIsRpcModalOpen] = useState(false);

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
    const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
    if (selectedWallet) {
      walletSelected(selectedWallet);
    }
  }, [network, router, router.isReady]);

  return (
    <div className={montserrat.className}>
      <Header />
      <Component {...pageProps} />

      <div className='globalRpcButton'>
        <button className='rpcButton' onClick={() => setIsRpcModalOpen(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '30px' }}>
            <Image src='/Settings.svg' alt='settings' width={24} height={24} />
          </div>
        </button>
      </div>

      <RpcSettingsModal
        isOpen={isRpcModalOpen}
        onClose={() => setIsRpcModalOpen(false)}
        onRpcChange={(url) => console.log('RPC changed to:', url)}
      />
    </div>
  );
}

export default App;
