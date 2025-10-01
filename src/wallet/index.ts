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
export const walletAdded = createEvent<string>();
export const accountSelected = createEvent<string>();
export const disconnectWallets = createEvent();

export const $walletExtensions = createStore<{ name: string }[]>([]);
export const $connectedWallets = createStore<string[]>([]).on(disconnectWallets, () => []);

export type WalletAccount = InjectedPolkadotAccount & { walletSource: string };

export const $loadedAccounts = createStore<WalletAccount[]>([]).on(disconnectWallets, () => []);
export const $selectedAccount = createStore<WalletAccount | null>(null).on(
  disconnectWallets,
  () => null
);

export const loadedAccountsSet = createEvent<WalletAccount[]>();
export const selectedAccountSet = createEvent<WalletAccount | null>();
export const connectedWalletsSet = createEvent<string[]>();

$loadedAccounts.on(loadedAccountsSet, (_, payload) => payload);
$selectedAccount.on(selectedAccountSet, (_, payload) => payload);
$connectedWallets.on(connectedWalletsSet, (_, payload) => payload);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isNovaRuntime = () =>
  typeof window !== 'undefined' &&
  typeof (window as any).walletExtension === 'object' &&
  (window as any).walletExtension.isNovaWallet === true;

async function connectWithRetries(
  extension: string,
  attempts = 8,
  delayMs = 150
): Promise<WalletAccount[]> {
  if (extension === 'mimir' && window !== window.parent) await isMimirReady();
  const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
  for (let i = 0; i < attempts; i++) {
    try {
      const ext = await connectInjectedExtension(realExtension);
      const accounts = ext.getAccounts();
      if (accounts && accounts.length > 0) {
        return accounts.map((a) => ({ ...a, walletSource: extension }));
      }
    } catch {}
    await sleep(delayMs * Math.min(1 + i, 10));
  }
  return [];
}

const getExtensionsFx = createEffect(async () => {
  const nova = isNovaRuntime();
  if (window !== window.parent && !nova) {
    const origin = await isMimirReady();
    if (origin && MIMIR_REGEXP.test(origin)) inject();
  }
  const exts = getInjectedExtensions();
  return exts.map((name) => (name === 'polkadot-js' && nova ? { name: 'nova' } : { name }));
});

export const walletAddedFx = createEffect(async (extension: string): Promise<WalletAccount[]> => {
  return connectWithRetries(extension);
});

type RestorePayload = {
  accounts: WalletAccount[];
  selected: WalletAccount | null;
  connectedWallets: string[];
};

export const restoreAllFromStorageFx = createEffect(async (): Promise<RestorePayload> => {
  await sleep(50);
  getInjectedExtensions();

  const savedWalletsStr = localStorage.getItem(CONNECTED_WALLETS_KEY);
  const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const selectedAddress = localStorage.getItem(SELECTED_ACCOUNT_KEY);

  const wallets: string[] = savedWalletsStr ? JSON.parse(savedWalletsStr) : [];

  const results = await Promise.all(wallets.map((w) => connectWithRetries(w)));
  const all = results.flat();
  const unique = all.filter((acc, i, arr) => arr.findIndex((a) => a.address === acc.address) === i);

  let selected: WalletAccount | null = null;
  if (selectedWallet && selectedAddress) {
    selected = unique.find((a) => a.address === selectedAddress) ?? null;
    if (!selected) {
      const direct = await connectWithRetries(selectedWallet);
      const match = direct.find((a) => a.address === selectedAddress);
      if (match) {
        if (!unique.some((u) => u.address === match.address)) unique.push(match);
        selected = match;
      }
    }
  }

  return { accounts: unique, selected, connectedWallets: wallets };
});

sample({ clock: getExtensions, target: getExtensionsFx });
sample({ clock: getExtensionsFx.doneData, target: $walletExtensions });

sample({ clock: walletAdded, target: walletAddedFx });

sample({
  clock: walletAddedFx.doneData,
  source: $loadedAccounts,
  fn: (prev, next) => {
    const merged = [...prev];
    for (const acc of next) if (!merged.some((a) => a.address === acc.address)) merged.push(acc);
    return merged;
  },
  target: loadedAccountsSet,
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
  target: selectedAccountSet,
});

sample({
  clock: restoreAllFromStorageFx.doneData,
  fn: (r) => r.accounts,
  target: loadedAccountsSet,
});
sample({
  clock: restoreAllFromStorageFx.doneData,
  fn: (r) => r.selected,
  target: selectedAccountSet,
});
sample({
  clock: restoreAllFromStorageFx.doneData,
  fn: (r) => r.connectedWallets,
  target: connectedWalletsSet,
});

walletAdded.watch((walletId) => {
  const stored = localStorage.getItem(CONNECTED_WALLETS_KEY);
  const wallets: string[] = stored ? JSON.parse(stored) : [];
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
