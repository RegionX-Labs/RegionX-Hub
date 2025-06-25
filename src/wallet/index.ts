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

type WalletExtension = {
  name: string;
};

export const $walletExtensions = createStore<WalletExtension[]>([]);
export const $loadedAccounts = createStore<InjectedPolkadotAccount[]>([]);
export const $selectedAccount = createStore<InjectedPolkadotAccount | null>(null);

const isNovaMobile = () =>
  typeof navigator !== 'undefined' && /NovaWallet/i.test(navigator.userAgent);

const getExtensionsFx = createEffect((): WalletExtension[] => {
  const extensions: string[] = getInjectedExtensions();
  return extensions.map((e) => ({ name: e }));
});

const walletSelectedFx = createEffect(
  async (extension: string): Promise<InjectedPolkadotAccount[]> => {
    let selectedKey = extension;

    if (extension === 'polkadot-js' && isNovaMobile()) {
      selectedKey = 'polkadot-js';
      localStorage.setItem(SELECTED_WALLET_KEY, 'nova');
    } else {
      localStorage.setItem(SELECTED_WALLET_KEY, extension);
    }

    const selectedExtension: InjectedExtension = await connectInjectedExtension(selectedKey);
    return selectedExtension.getAccounts();
  }
);

const restoreAccountFx = createEffect(async (): Promise<InjectedPolkadotAccount | null> => {
  let selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const selectedAccount = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  if (!selectedWallet || !selectedAccount) return null;

  if (selectedWallet === 'nova') {
    selectedWallet = 'polkadot-js';
  }

  const extension = await connectInjectedExtension(selectedWallet);
  const accounts = await extension.getAccounts();
  return accounts.find((a) => a.address === selectedAccount) || null;
});

sample({
  clock: getExtensions,
  target: getExtensionsFx,
});

sample({
  clock: getExtensionsFx.doneData,
  target: $walletExtensions,
});

sample({
  clock: walletSelected,
  target: walletSelectedFx,
});

sample({
  clock: walletSelectedFx.done,
  fn: () => null,
  target: $selectedAccount,
});

sample({
  clock: walletSelectedFx.doneData,
  target: $loadedAccounts,
});

sample({
  clock: accountSelected,
  source: $loadedAccounts,
  fn: (accounts, selectedAddr) => {
    localStorage.setItem(SELECTED_ACCOUNT_KEY, selectedAddr);
    return accounts.find((a) => a.address === selectedAddr) || null;
  },
  target: $selectedAccount,
});

sample({
  clock: restoreSelectedAccount,
  target: restoreAccountFx,
});

sample({
  clock: restoreAccountFx.doneData,
  target: $selectedAccount,
});

$selectedAccount.reset(disconnectWallet);
$loadedAccounts.reset(disconnectWallet);
$walletExtensions.reset(disconnectWallet);

disconnectWallet.watch(() => {
  localStorage.removeItem(SELECTED_WALLET_KEY);
  localStorage.removeItem(SELECTED_ACCOUNT_KEY);
});

sample({
  clock: disconnectWallet,
  target: getExtensions,
});
