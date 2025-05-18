import '../styles/global.scss';
import '@region-x/components/dist/style.css';
import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Network } from '@/types';
import { $connections, $network, networkStarted } from '@/api/connection';
import {
  getExtensions,
  SELECTED_WALLET_KEY,
  walletSelected,
  restoreSelectedAccount,
  $selectedAccount,
} from '@/wallet';
import { Montserrat } from 'next/font/google';
import RpcSettingsModal from '@/components/RpcSettingsModal';
import Image from 'next/image';
import { useUnit } from 'effector-react';
import { getAccountData } from '@/account';

const montserrat = Montserrat({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { network: networkFromRouter } = router.query;

  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const [isRpcModalOpen, setIsRpcModalOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    let _network = Network.NONE;
    if (networkFromRouter === 'polkadot') _network = Network.POLKADOT;
    else if (networkFromRouter === 'kusama') _network = Network.KUSAMA;
    else if (networkFromRouter === 'paseo') _network = Network.PASEO;
    else if (networkFromRouter === 'rococo') _network = Network.ROCOCO;
    else if (networkFromRouter === 'westend') _network = Network.WESTEND;
    else {
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
      return;
    }

    networkStarted(_network);
    getExtensions();

    const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
    if (selectedWallet) {
      walletSelected(selectedWallet);
      restoreSelectedAccount();
    }
  }, [networkFromRouter, router, router.isReady]);

  useEffect(() => {
    if(!selectedAccount) return;

    getAccountData({account: selectedAccount.address, connections, network})
  }, [connections, network, selectedAccount]);

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
