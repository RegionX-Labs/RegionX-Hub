// src/wallet/index.ts
'use client';

import { createEffect, createEvent, createStore, sample } from 'effector';
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedPolkadotAccount,
} from 'polkadot-api/pjs-signer';
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

export const SELECTED_WALLET_KEY = 'wallet_selected';
export const SELECTED_ACCOUNT_KEY = 'account_selected';
const CONNECTED_WALLETS_KEY = 'connected_wallets';

export const getExtensions = createEvent();
export const walletSelected = createEvent<string>();
export const walletAdded = createEvent<string>();
export const accountSelected = createEvent<string>();
export const restoreAllFromStorage = createEvent();
export const disconnectWallets = createEvent();

export type WalletAccount = InjectedPolkadotAccount & { walletSource: string };

export const $walletExtensions = createStore<{ name: string }[]>([]);
export const $connectedWallets = createStore<string[]>([])
  .on(walletAdded, (state, id) => (state.includes(id) ? state : [...state, id]))
  .reset(disconnectWallets);
export const $loadedAccounts = createStore<WalletAccount[]>([]).reset(disconnectWallets);
export const $selectedAccount = createStore<WalletAccount | null>(null).reset(disconnectWallets);

export const selectedAccountSet = createEvent<WalletAccount | null>();
export const connectedWalletsSet = createEvent<string[]>();
export const walletInitFinished = createEvent();

export const $walletInitDone = createStore(false)
  .on(restoreAllFromStorage, () => false)
  .on(disconnectWallets, () => true)
  .on(walletInitFinished, () => true);

export const loadedAccountsSet = createEvent<WalletAccount[]>();
$loadedAccounts.on(loadedAccountsSet, (_, payload) => payload);
$selectedAccount.on(selectedAccountSet, (_, acc) => acc);
$connectedWallets.on(connectedWalletsSet, (_, list) => list);

const getExtensionsFx = createEffect<void, { name: string }[]>(async () => {
  const isNova =
    typeof window !== 'undefined' &&
    typeof (window as any).walletExtension === 'object' &&
    (window as any).walletExtension.isNovaWallet === true;
  if (typeof window !== 'undefined' && window !== window.parent && !isNova) {
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

const connectWalletFx = createEffect<string, WalletAccount[]>(async (extension: string) => {
  if (extension === 'mimir' && typeof window !== 'undefined' && window !== window.parent) {
    await isMimirReady();
  }
  const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = ext.getAccounts();
  return accounts.map((a) => ({ ...a, walletSource: extension }));
});

const walletSelectedFx = connectWalletFx;
export const walletAddedFx = connectWalletFx;

type RestoreResult = {
  accounts: WalletAccount[];
  selected: WalletAccount | null;
  connectedWallets: string[];
};

const restoreAllFromStorageFx = createEffect<void, RestoreResult>(async () => {
  const storedWalletsRaw = localStorage.getItem(CONNECTED_WALLETS_KEY);
  const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const selectedAddress = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  const connectedWallets: string[] = storedWalletsRaw ? JSON.parse(storedWalletsRaw) : [];
  if (connectedWallets.length === 0) {
    return { accounts: [], selected: null, connectedWallets: [] };
  }
  const results = await Promise.allSettled(connectedWallets.map((w) => connectWalletFx(w)));
  const all: WalletAccount[] = [];
  for (const r of results) if (r.status === 'fulfilled') all.push(...r.value);
  const dedup: WalletAccount[] = [];
  const seen = new Set<string>();
  for (const a of all) {
    if (!seen.has(a.address)) {
      seen.add(a.address);
      dedup.push(a);
    }
  }
  let selected: WalletAccount | null = null;
  if (selectedWallet && selectedAddress) {
    selected = dedup.find((a) => a.address === selectedAddress) ?? null;
  }
  if (!selected && dedup.length > 0) {
    selected = dedup[0];
    localStorage.setItem(SELECTED_ACCOUNT_KEY, selected.address);
    localStorage.setItem(SELECTED_WALLET_KEY, selected.walletSource);
  }
  return { accounts: dedup, selected, connectedWallets };
});

sample({ clock: getExtensions, target: getExtensionsFx });
sample({ clock: getExtensionsFx.doneData, target: $walletExtensions });

sample({ clock: walletSelected, target: walletSelectedFx });
sample({ clock: walletSelectedFx.doneData, target: $loadedAccounts });

sample({ clock: walletAdded, target: walletAddedFx });

sample({
  clock: walletAddedFx.doneData,
  source: $loadedAccounts,
  fn: (prev, next) => {
    const merged = [...prev];
    for (const acc of next) if (!merged.some((a) => a.address === acc.address)) merged.push(acc);
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
    return acc;
  },
  target: $selectedAccount,
});

sample({ clock: restoreAllFromStorage, target: restoreAllFromStorageFx });

sample({
  clock: restoreAllFromStorageFx.done,
  fn: ({ result }) => result.accounts,
  target: loadedAccountsSet,
});

sample({
  clock: restoreAllFromStorageFx.done,
  fn: ({ result }) => result.selected,
  target: selectedAccountSet,
});

sample({
  clock: restoreAllFromStorageFx.done,
  fn: ({ result }) => result.connectedWallets,
  target: connectedWalletsSet,
});

sample({ clock: restoreAllFromStorageFx.done, target: walletInitFinished });

walletAdded.watch((walletId) => {
  const stored = localStorage.getItem(CONNECTED_WALLETS_KEY);
  const wallets = stored ? JSON.parse(stored) : [];
  if (!wallets.includes(walletId)) {
    wallets.push(walletId);
    localStorage.setItem(CONNECTED_WALLETS_KEY, JSON.stringify(wallets));
  }
});

disconnectWallets.watch(() => {
  localStorage.removeItem(SELECTED_WALLET_KEY);
  localStorage.removeItem(SELECTED_ACCOUNT_KEY);
  localStorage.removeItem(CONNECTED_WALLETS_KEY);
});
