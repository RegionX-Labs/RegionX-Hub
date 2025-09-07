'use client';

import { useEffect, useState } from 'react';
import '@/styles/global.scss';
import '@region-x/components/dist/style.css';
import { Analytics } from '@vercel/analytics/next';
import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { Network } from '@/types';
import { $connections, $network, networkStarted } from '@/api/connection';
import {
  getExtensions,
  SELECTED_WALLET_KEY,
  SELECTED_ACCOUNT_KEY,
  walletAdded,
  accountSelected,
  $selectedAccount,
  $loadedAccounts,
  loadedAccountsSet,
  walletAddedFx,
} from '@/wallet';
import { Montserrat } from 'next/font/google';
import RpcSettingsModal from '@/components/RpcSettingsModal';
import { useUnit } from 'effector-react';
import { getAccountData } from '@/account';
import { identityRequested } from '@/account/accountIdentity';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { regionsRequested } from '@/coretime/regions';
import Head from 'next/head';

const montserrat = Montserrat({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { network: networkFromRouter } = router.query;

  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);
  const loadedAccounts = useUnit($loadedAccounts);
  const saleInfo = useUnit($latestSaleInfo);

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

    const savedWallets = localStorage.getItem('connected_wallets');
    const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
    const selectedAddress = localStorage.getItem(SELECTED_ACCOUNT_KEY);

    if (savedWallets) {
      const wallets: string[] = JSON.parse(savedWallets);

      Promise.all(
        wallets.map((wallet) => {
          walletAdded(wallet);
          return walletAddedFx(wallet);
        })
      ).then((results) => {
        const allAccounts = results.flat();
        const uniqueAccounts = allAccounts.filter(
          (acc, i, arr) => arr.findIndex((a) => a.address === acc.address) === i
        );
        loadedAccountsSet(uniqueAccounts);

        if (selectedWallet && selectedAddress) {
          const match = uniqueAccounts.find((a) => a.address === selectedAddress);
          if (match) {
            accountSelected(match.address);
          }
        }
      });
    }
  }, [networkFromRouter, router]);

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
        onRpcChange={(url) => console.log('RPC changed to:', url)}
      />

      {/* FLOATING BUTTONS: show only on desktop */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
        className='floating-settings'
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

      <style jsx>{`
        .floating-settings {
          display: none;
        }
        @media (min-width: 768px) {
          .floating-settings {
            display: block !important;
          }
        }
      `}</style>

      <Analytics />
    </div>
  );
}

export default App;
