'use client';

import { useEffect, useRef, useState } from 'react';
import '@/styles/global.scss';
import '@region-x/components/dist/style.css';
import { Analytics } from '@vercel/analytics/next';
import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { Network } from '@/types';
import { $connections, $network, networkStarted, rpcEndpointUpdated } from '@/api/connection';
import {
  getExtensions,
  SELECTED_WALLET_KEY,
  SELECTED_ACCOUNT_KEY,
  walletAdded,
  accountSelected,
  $selectedAccount,
  $loadedAccounts,
  $connectedWallets,
} from '@/wallet';
import { Montserrat } from 'next/font/google';
import RpcSettingsModal from '@/components/RpcSettingsModal';
import { useUnit } from 'effector-react';
import { getAccountData } from '@/account';
import { identityRequested } from '@/account/accountIdentity';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { regionsRequested } from '@/coretime/regions';
import Head from 'next/head';
import { chains, getNetworkChainIds } from '@/network';
import { RPC_SETTINGS_KEY, RpcSettings } from '@/constants/rpc';
import toast, { Toaster } from 'react-hot-toast';

const montserrat = Montserrat({ subsets: ['latin'] });

const saveRpcSettings = (network: Network, relayUrl: string, coretimeUrl: string) => {
  const storedRaw = localStorage.getItem(RPC_SETTINGS_KEY);
  let parsed: RpcSettings = {};

  if (storedRaw) {
    try {
      parsed = JSON.parse(storedRaw) as RpcSettings;
    } catch {
      parsed = {};
    }
  }

  parsed[network] = { relayUrl, coretimeUrl };
  localStorage.setItem(RPC_SETTINGS_KEY, JSON.stringify(parsed));
};

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { network: networkFromRouter } = router.query;

  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);
  const loadedAccounts = useUnit($loadedAccounts);
  const saleInfo = useUnit($latestSaleInfo);
  const connectedWallets = useUnit($connectedWallets);
  const errorShownForChain = useRef<Record<string, boolean>>({});

  const [isRpcModalOpen, setIsRpcModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initialTheme = stored === 'light' ? 'light' : 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    Object.entries(connections).forEach(([chainId, connection]) => {
      if (connection.status === 'connected') {
        errorShownForChain.current[chainId] = false;
        return;
      }

      if (connection.status === 'error' && !errorShownForChain.current[chainId]) {
        const chainName =
          Object.values(chains).find((chain) => chain.chainId === chainId)?.name || 'chain';
        toast.error(`Failed to connect to ${chainName} RPC. Please check your endpoint.`, {
          position: 'bottom-left',
        });
        errorShownForChain.current[chainId] = true;
      }
    });
  }, [connections]);

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
  }, [networkFromRouter, router]);

  useEffect(() => {
    (async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      // takes some time to load extensions.
      await sleep(400);
      const _savedWallets = localStorage.getItem('connected_wallets');
      if (_savedWallets) {
        const savedWallets: string[] = JSON.parse(_savedWallets);
        savedWallets.map((wallet) => {
          walletAdded(wallet);
        });
      }
    })();
  }, [connectedWallets]);

  useEffect(() => {
    const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
    const selectedAddress = localStorage.getItem(SELECTED_ACCOUNT_KEY);

    const allAccounts = loadedAccounts.flat();

    if (selectedWallet && selectedAddress) {
      const match = allAccounts.find((a) => a.address === selectedAddress);
      if (match) {
        accountSelected(match.address);
      }
    }
  }, [loadedAccounts]);

  useEffect(() => {
    if (!selectedAccount) return;
    getAccountData({ account: selectedAccount.address, connections, network });
  }, [connections, network, selectedAccount]);

  useEffect(() => {
    identityRequested({ accounts: loadedAccounts, network, connections });
  }, [connections, network, loadedAccounts]);

  useEffect(() => {
    latestSaleRequested(network);
  }, [network, connections]);

  useEffect(() => {
    if (!saleInfo) return;
    const regionDuration = saleInfo.regionEnd - saleInfo.regionBegin;
    const afterTimeslice = saleInfo.regionBegin - regionDuration;
    regionsRequested({ connections, network, afterTimeslice });
  }, [network, saleInfo]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const nextUrl = new URL(window.location.origin + url);
      if (nextUrl.pathname === '/') return;

      nextUrl.searchParams.delete('dashboard');
      nextUrl.searchParams.delete('paraId');

      const newUrl = `${nextUrl.pathname}${
        nextUrl.search ? '?' + nextUrl.searchParams.toString() : ''
      }`;
      if (newUrl !== window.location.pathname + window.location.search) {
        window.history.replaceState({}, '', newUrl);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  if (!hasMounted) return null;

  return (
    <div className={montserrat.className}>
      <Head>
        <title>RegionX Hub</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter&family=Montserrat&display=swap'
          rel='stylesheet'
        />
      </Head>

      <Header theme={theme} setTheme={setTheme} openRpcModal={() => setIsRpcModalOpen(true)} />
      <Component {...pageProps} />
      <RpcSettingsModal
        isOpen={isRpcModalOpen}
        onClose={() => setIsRpcModalOpen(false)}
        onRpcChange={(relayUrl, coretimeUrl) => {
          const chainIds = getNetworkChainIds(network);
          if (!chainIds) return;

          saveRpcSettings(network, relayUrl, coretimeUrl);
          rpcEndpointUpdated({ chainId: chainIds.relayChain, url: relayUrl });
          rpcEndpointUpdated({ chainId: chainIds.coretimeChain, url: coretimeUrl });
        }}
      />

      <div
        className='floating-actions'
        style={{
          position: 'fixed',
          bottom: 30,
          right: 20,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: '#1f1f1f',
            borderRadius: '30px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          }}
        >
          <button
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            title='Toggle Theme'
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={theme === 'dark' ? '/LightMode.svg' : '/DarkMode.svg'}
              alt={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              width={24}
              height={24}
            />
          </button>

          <button
            onClick={() => setIsRpcModalOpen(true)}
            title='RPC Settings'
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img src='/Settings.svg' alt='settings' width={24} height={24} />
          </button>
        </div>
      </div>

      <div
        className='powered-badge'
        style={{
          position: 'fixed',
          bottom: 10,
          right: 20,
          zIndex: 9998,
        }}
      >
        <img
          src={theme === 'light' ? '/powered_black_pink.png' : '/powered_white_pink.png'}
          alt='Powered by Polkadot'
          style={{
            width: 105,
            height: 'auto',
            marginTop: 0,
            display: 'block',
          }}
        />
      </div>

      <style jsx>{`
        .floating-actions {
          display: none;
        }
        @media (min-width: 768px) {
          .floating-actions {
            display: block !important;
          }
        }

        /* Badge is always visible */
        .powered-badge {
          display: block;
        }
      `}</style>

      <Toaster />
      <Analytics />
    </div>
  );
}

export default App;
