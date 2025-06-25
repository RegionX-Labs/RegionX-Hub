import { createEffect, createEvent, createStore, sample } from 'effector';
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedExtension,
  InjectedPolkadotAccount,
} from 'polkadot-api/pjs-signer';

export const SELECTED_WALLET_KEY = 'wallet_selected';
export const SELECTED_ACCOUNT_KEY = 'account_selected';

export const getExtensions = createEvent();
export const walletSelected = createEvent<string>();
export const accountSelected = createEvent<string>();
export const restoreSelectedAccount = createEvent();
export const disconnectWallet = createEvent();

type WalletExtension = { name: string };

export const $walletExtensions = createStore<WalletExtension[]>([]);
export const $loadedAccounts = createStore<InjectedPolkadotAccount[]>([]);
export const $selectedAccount = createStore<InjectedPolkadotAccount | null>(null);

const isNovaMobile = () =>
  typeof navigator !== 'undefined' && /NovaWallet/i.test(navigator.userAgent);

const getExtensionsFx = createEffect((): WalletExtension[] => {
  const extensions = getInjectedExtensions();
  return extensions.map((e) => ({ name: e }));
});

const walletSelectedFx = createEffect(
  async (extension: string): Promise<InjectedPolkadotAccount[]> => {
    let selectedKey = extension;

    if (extension === 'nova') {
      selectedKey = 'polkadot-js';
    }

    const injected = await connectInjectedExtension(selectedKey);
    return injected.getAccounts();
  }
);

const restoreAccountFx = createEffect(async (): Promise<InjectedPolkadotAccount | null> => {
  let wallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const account = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  if (!wallet || !account) return null;

  if (wallet === 'nova') wallet = 'polkadot-js';
  const extension = await connectInjectedExtension(wallet);
  const accounts = await extension.getAccounts();
  return accounts.find((a) => a.address === account) || null;
});

sample({ clock: getExtensions, target: getExtensionsFx });
sample({ clock: getExtensionsFx.doneData, target: $walletExtensions });
sample({ clock: walletSelected, target: walletSelectedFx });
sample({ clock: walletSelectedFx.doneData, target: $loadedAccounts });
sample({ clock: walletSelectedFx.done, fn: () => null, target: $selectedAccount });

sample({
  clock: accountSelected,
  source: $loadedAccounts,
  fn: (accounts, address) => {
    localStorage.setItem(SELECTED_ACCOUNT_KEY, address);
    return accounts.find((a) => a.address === address) || null;
  },
  target: $selectedAccount,
});

sample({ clock: restoreSelectedAccount, target: restoreAccountFx });
sample({ clock: restoreAccountFx.doneData, target: $selectedAccount });

$selectedAccount.reset(disconnectWallet);
$loadedAccounts.reset(disconnectWallet);
$walletExtensions.reset(disconnectWallet);

disconnectWallet.watch(() => {
  localStorage.removeItem(SELECTED_WALLET_KEY);
  localStorage.removeItem(SELECTED_ACCOUNT_KEY);
});

sample({ clock: disconnectWallet, target: getExtensions });
