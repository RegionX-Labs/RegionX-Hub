import '@/styles/global.scss';
import '@region-x/components/dist/style.css';
import { Analytics } from '@vercel/analytics/next';
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
import Head from 'next/head';

const montserrat = Montserrat({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { network: networkFromRouter } = router.query;

  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);

  const [isRpcModalOpen, setIsRpcModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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
        { pathname: router.pathname, query: { ...router.query, network: 'polkadot' } },
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

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [networkFromRouter, router]);

  useEffect(() => {
    if (!selectedAccount) return;
    getAccountData({ account: selectedAccount.address, connections, network });
  }, [connections, network, selectedAccount]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={montserrat.className}>
      <Head>
        <title>RegionX Hub</title>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter&family=Montserrat&display=swap'
          rel='stylesheet'
        />
      </Head>

      <Header theme={theme} />

      <div style={{ position: 'fixed', top: 15, right: 15, zIndex: 9999 }}>
        <button
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          aria-label='Toggle Theme'
          style={{
            backgroundColor: 'var(--accent-green)',
            color: 'var(--text-primary)',
            border: 'none',
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          }}
        >
          {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
        </button>
      </div>

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

      <Analytics />
    </div>
  );
}

export default App;
