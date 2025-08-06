import { createEffect, createEvent, createStore, sample } from 'effector';
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedExtension,
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

export const $loadedAccounts = createStore<InjectedPolkadotAccount[]>([]).reset(disconnectWallets);

export const $selectedAccount = createStore<InjectedPolkadotAccount | null>(null).reset(
  disconnectWallets
);

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
    if (extName === 'polkadot-js' && isNova) {
      return { name: 'nova' };
    }
    return { name: extName };
  });
});

const walletSelectedFx = createEffect(
  async (extension: string): Promise<InjectedPolkadotAccount[]> => {
    const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
    const ext = await connectInjectedExtension(realExtension);
    return ext.getAccounts();
  }
);

const walletAddedFx = createEffect(
  async (extension: string): Promise<InjectedPolkadotAccount[]> => {
    const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
    const ext = await connectInjectedExtension(realExtension);
    return ext.getAccounts();
  }
);

const restoreAccountFx = createEffect(async (): Promise<InjectedPolkadotAccount | null> => {
  const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const selectedAccount = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  if (!selectedWallet || !selectedAccount) return null;

  const realExtension = selectedWallet === 'nova' ? 'polkadot-js' : selectedWallet;
  const ext = await connectInjectedExtension(realExtension);
  const accounts = await ext.getAccounts();
  return accounts.find((a) => a.address === selectedAccount) || null;
});

sample({ clock: getExtensions, target: getExtensionsFx });
sample({ clock: getExtensionsFx.doneData, target: $walletExtensions });

sample({ clock: walletSelected, target: walletSelectedFx });
sample({ clock: walletSelectedFx.doneData, target: $loadedAccounts });
sample({ clock: walletSelectedFx.done, fn: () => null, target: $selectedAccount });

sample({
  clock: accountSelected,
  source: $loadedAccounts,
  fn: (accounts, selectedAddr) => {
    localStorage.setItem(SELECTED_ACCOUNT_KEY, selectedAddr);
    return accounts.find((a) => a.address === selectedAddr) || null;
  },
  target: $selectedAccount,
});

sample({ clock: restoreSelectedAccount, target: restoreAccountFx });
sample({ clock: restoreAccountFx.doneData, target: $selectedAccount });

sample({ clock: walletAdded, target: walletAddedFx });

sample({
  clock: walletAddedFx.doneData,
  source: $loadedAccounts,
  fn: (prev, newAccounts) => {
    const merged = [...prev];
    for (const acc of newAccounts) {
      if (!prev.some((a) => a.address === acc.address)) {
        merged.push(acc);
      }
    }
    return merged;
  },
  target: $loadedAccounts,
});

disconnectWallets.watch(() => {
  localStorage.removeItem(SELECTED_WALLET_KEY);
  localStorage.removeItem(SELECTED_ACCOUNT_KEY);
});
