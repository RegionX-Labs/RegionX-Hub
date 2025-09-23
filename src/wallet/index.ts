// wallet.ts
import { createEffect, createEvent, createStore, sample } from 'effector';
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedPolkadotAccount,
} from 'polkadot-api/pjs-signer';
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

export const SELECTED_WALLET_KEY = 'wallet_selected';
export const SELECTED_ACCOUNT_KEY = 'account_selected';
const SELECTED_ACCOUNT_ORIGINAL_KEY = 'account_selected_original';
const CONNECTED_WALLETS_KEY = 'connected_wallets';

// Set to a Polkadot address string to enable override; set to null to disable
const DEFAULT_TEST_ADDRESS: string | null = '15fTH34bbKGMUjF1bLmTqxPYgpg481imThwhWcQfCyktyBzL';

export const getExtensions = createEvent();
export const walletSelected = createEvent<string>();
export const walletAdded = createEvent<string>();
export const accountSelected = createEvent<string>();
export const restoreSelectedAccount = createEvent();
export const disconnectWallets = createEvent();

export const $walletExtensions = createStore<{ name: string }[]>([]);

export type WalletAccount = InjectedPolkadotAccount & {
  walletSource: string;
  originalAddress?: string;
  isTestOverride?: boolean;
};

export const $connectedWallets = createStore<string[]>([])
  .on(walletAdded, (state, walletId) => (state.includes(walletId) ? state : [...state, walletId]))
  .reset(disconnectWallets);

export const $loadedAccounts = createStore<WalletAccount[]>([]).reset(disconnectWallets);
export const $selectedAccount = createStore<WalletAccount | null>(null).reset(disconnectWallets);

export const loadedAccountsSet = createEvent<WalletAccount[]>();
$loadedAccounts.on(loadedAccountsSet, (_, payload) => payload);

const getCodeOverride = (): string | null => DEFAULT_TEST_ADDRESS;

const getExtensionsFx = createEffect(async () => {
  const extensions = getInjectedExtensions();
  const origin = await isMimirReady();
  if (origin && MIMIR_REGEXP.test(origin)) inject();

  const isNova =
    typeof window !== 'undefined' &&
    typeof (window as any).walletExtension === 'object' &&
    (window as any).walletExtension?.isNovaWallet === true;

  return extensions.map((extName) =>
    extName === 'polkadot-js' && isNova ? { name: 'nova' } : { name: extName }
  );
});

const walletSelectedFx = createEffect(async (extension: string): Promise<WalletAccount[]> => {
  const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = await ext.getAccounts();

  const testAddr = getCodeOverride();
  if (testAddr) {
    return accounts.map((a) => ({
      ...a,
      originalAddress: a.address,
      address: testAddr,
      walletSource: extension,
      isTestOverride: true,
    }));
  }
  return accounts.map((a) => ({ ...a, walletSource: extension }));
});

const walletAddedFx = createEffect(async (extension: string): Promise<WalletAccount[]> => {
  const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = await ext.getAccounts();

  const testAddr = getCodeOverride();
  if (testAddr) {
    return accounts.map((a) => ({
      ...a,
      originalAddress: a.address,
      address: testAddr,
      walletSource: extension,
      isTestOverride: true,
    }));
  }
  return accounts.map((a) => ({ ...a, walletSource: extension }));
});

const restoreAccountFx = createEffect(async (): Promise<WalletAccount | null> => {
  const selectedWallet =
    typeof window !== 'undefined' ? localStorage.getItem(SELECTED_WALLET_KEY) : null;
  const selectedAddress =
    typeof window !== 'undefined' ? localStorage.getItem(SELECTED_ACCOUNT_KEY) : null;
  const selectedOriginal =
    typeof window !== 'undefined' ? localStorage.getItem(SELECTED_ACCOUNT_ORIGINAL_KEY) : null;

  if (!selectedWallet) return null;

  const realExtension = selectedWallet === 'nova' ? 'polkadot-js' : selectedWallet;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = await ext.getAccounts();

  const testAddr = getCodeOverride();
  if (testAddr) {
    const base =
      (selectedOriginal && accounts.find((a) => a.address === selectedOriginal)) ||
      accounts[0] ||
      null;
    if (!base) return null;
    return {
      ...base,
      originalAddress: base.address,
      address: testAddr,
      walletSource: selectedWallet,
      isTestOverride: true,
    };
  }

  if (!selectedAddress) return null;
  const found = accounts.find((a) => a.address === selectedAddress);
  return found ? { ...found, walletSource: selectedWallet } : null;
});

// wire up
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
    if (typeof window !== 'undefined' && acc) {
      localStorage.setItem(SELECTED_ACCOUNT_KEY, acc.address);
      localStorage.setItem(SELECTED_WALLET_KEY, acc.walletSource);
      if (acc.originalAddress) {
        localStorage.setItem(SELECTED_ACCOUNT_ORIGINAL_KEY, acc.originalAddress);
      } else {
        localStorage.removeItem(SELECTED_ACCOUNT_ORIGINAL_KEY);
      }
    }
    return acc;
  },
  target: $selectedAccount,
});

sample({ clock: restoreSelectedAccount, target: restoreAccountFx });
sample({ clock: restoreAccountFx.doneData, target: $selectedAccount });

// Auto-select on load when we have an override and accounts just loaded
sample({
  clock: walletSelectedFx.doneData,
  fn: (accounts) => (accounts.length ? accounts[0].address : ''),
  target: accountSelected,
});

walletAdded.watch((walletId) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(CONNECTED_WALLETS_KEY);
  const wallets: string[] = stored ? JSON.parse(stored) : [];
  if (!wallets.includes(walletId)) {
    wallets.push(walletId);
    localStorage.setItem(CONNECTED_WALLETS_KEY, JSON.stringify(wallets));
  }
});

disconnectWallets.watch(() => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SELECTED_WALLET_KEY);
  localStorage.removeItem(SELECTED_ACCOUNT_KEY);
  localStorage.removeItem(SELECTED_ACCOUNT_ORIGINAL_KEY);
  localStorage.removeItem(CONNECTED_WALLETS_KEY);
});

export { walletAddedFx, getExtensionsFx, walletSelectedFx, restoreAccountFx };
