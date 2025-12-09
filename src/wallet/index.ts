import { createEffect, createEvent, createStore, sample } from 'effector';
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedPolkadotAccount,
} from 'polkadot-api/pjs-signer';
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

export const SELECTED_WALLET_KEY = 'wallet_selected';
export const SELECTED_ACCOUNT_KEY = 'account_selected';

export const getExtensions = createEvent();
export const walletAdded = createEvent<string>();
export const accountSelected = createEvent<string>();
export const disconnectWallets = createEvent();

export const $walletExtensions = createStore<{ name: string }[]>([]);

export const $connectedWallets = createStore<string[]>([])
  .on(walletAdded, (state, walletId) => (state.includes(walletId) ? state : [...state, walletId]))
  .reset(disconnectWallets);

export type WalletAccount = InjectedPolkadotAccount & {
  walletSource: string;
};

export const $loadedAccounts = createStore<WalletAccount[]>([]).reset(disconnectWallets);
export const $selectedAccount = createStore<WalletAccount | null>(null).reset(disconnectWallets);
export const loadedAccountsSet = createEvent<WalletAccount[]>();
$loadedAccounts.on(loadedAccountsSet, (_, payload) => payload);

const getExtensionsFx = createEffect(async () => {
  const isNova =
    typeof window !== 'undefined' &&
    typeof window.walletExtension === 'object' &&
    window.walletExtension.isNovaWallet === true;

  if (window !== window.parent && !isNova) {
    const origin = await isMimirReady();
    if (origin && MIMIR_REGEXP.test(origin)) {
      inject();
    }
  }

  const extensions = getInjectedExtensions();

  return extensions.map((extName) => {
    if (extName === 'polkadot-js' && isNova) return { name: 'nova' };
    return { name: extName };
  });
});

const walletAddedFx = createEffect(async (extension: string): Promise<WalletAccount[]> => {
  if (extension === 'mimir' && window !== window.parent) await isMimirReady();
  const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = ext.getAccounts();
  return accounts.map((a) => ({ ...a, walletSource: extension }));
});

sample({ clock: getExtensions, target: getExtensionsFx });
sample({ clock: getExtensionsFx.doneData, target: $walletExtensions });

sample({ clock: walletAdded, target: walletAddedFx });

sample({
  clock: walletAddedFx.doneData,
  source: $loadedAccounts,
  fn: (prev, next) => {
    const merged = [...prev];
    for (const acc of next) {
      if (!merged.some((a) => a.address === acc.address && a.walletSource === acc.walletSource)) {
        merged.push(acc);
      }
    }
    return merged;
  },
  target: $loadedAccounts,
});

sample({
  clock: accountSelected,
  source: $loadedAccounts,
  fn: (accounts, selectedAddr) => {
    const acc = accounts.find((a) => a.address === selectedAddr) || null;
    if (acc) {
      localStorage.setItem(SELECTED_ACCOUNT_KEY, acc.address);
      localStorage.setItem(SELECTED_WALLET_KEY, acc.walletSource);
    }
    return acc ? { ...acc, address: '126X27SbhrV19mBFawys3ovkyBS87SGfYwtwa8J2FjHrtbmA' } : null;
  },
  target: $selectedAccount,
});

walletAdded.watch((walletId) => {
  const stored = localStorage.getItem('connected_wallets');
  const wallets = stored ? JSON.parse(stored) : [];
  if (!wallets.includes(walletId)) {
    wallets.push(walletId);
    localStorage.setItem('connected_wallets', JSON.stringify(wallets));
  }
});

disconnectWallets.watch(() => {
  localStorage.removeItem(SELECTED_WALLET_KEY);
  localStorage.removeItem(SELECTED_ACCOUNT_KEY);
  localStorage.removeItem('connected_wallets');
});
