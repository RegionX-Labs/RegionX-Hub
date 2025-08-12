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
export const walletSelected = createEvent<string>();
export const walletAdded = createEvent<string>();
export const accountSelected = createEvent<string>();
export const restoreSelectedAccount = createEvent();
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
  const extensions = getInjectedExtensions();
  const origin = await isMimirReady();
  if (origin && MIMIR_REGEXP.test(origin)) {
    inject();
  }

  const isNova =
    typeof window !== 'undefined' &&
    typeof window.walletExtension === 'object' &&
    window.walletExtension.isNovaWallet === true;

  return extensions.map((extName) => {
    if (extName === 'polkadot-js' && isNova) return { name: 'nova' };
    return { name: extName };
  });
});

const walletSelectedFx = createEffect(async (extension: string): Promise<WalletAccount[]> => {
  const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = await ext.getAccounts();
  return accounts.map((a) => ({ ...a, walletSource: extension }));
});

const walletAddedFx = createEffect(async (extension: string): Promise<WalletAccount[]> => {
  const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = await ext.getAccounts();
  return accounts.map((a) => ({ ...a, walletSource: extension }));
});

const restoreAccountFx = createEffect(async (): Promise<WalletAccount | null> => {
  const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const selectedAddress = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  if (!selectedWallet || !selectedAddress) return null;

  const realExtension = selectedWallet === 'nova' ? 'polkadot-js' : selectedWallet;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = await ext.getAccounts();
  const found = accounts.find((a) => a.address === selectedAddress);
  if (!found) return null;
  return { ...found, walletSource: selectedWallet };
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
    for (const acc of next) {
      if (!merged.some((a) => a.address === acc.address)) {
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
    return acc;
  },
  target: $selectedAccount,
});

sample({ clock: restoreSelectedAccount, target: restoreAccountFx });
sample({ clock: restoreAccountFx.doneData, target: $selectedAccount });

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

export { walletAddedFx };
