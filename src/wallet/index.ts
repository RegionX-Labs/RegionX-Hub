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

type WalletExtension = {
  name: string;
};

export const $walletExtensions = createStore<WalletExtension[]>([]);
export const $loadedAccounts = createStore<InjectedPolkadotAccount[]>([]);
export const $selectedAccount = createStore<InjectedPolkadotAccount | null>(null);

const getExtensionsFx = createEffect((): WalletExtension[] => {
  const extensions: string[] = getInjectedExtensions();

  // Add explicit Nova Wallet detection
  if (typeof window !== 'undefined' && window.injectedWeb3?.nova) {
    if (!extensions.includes('nova')) {
      extensions.push('nova');
    }
  }

  return extensions.map((e) => ({ name: e }));
});

const walletSelectedFx = createEffect(
  async (extension: string): Promise<InjectedPolkadotAccount[]> => {
    if (!extension) return [];

    try {
      const selectedExtension: InjectedExtension = await connectInjectedExtension(extension);
      return await selectedExtension.getAccounts();
    } catch (error) {
      console.error(`Wallet connection failed: ${error}`);
      return [];
    }
  }
);

const restoreAccountFx = createEffect(async (): Promise<InjectedPolkadotAccount | null> => {
  const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const selectedAccount = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  if (!selectedWallet || !selectedAccount) return null;

  try {
    const extension = await connectInjectedExtension(selectedWallet);
    const accounts = await extension.getAccounts();
    return accounts.find((a) => a.address === selectedAccount) || null;
  } catch (error) {
    console.error(`Account restore failed: ${error}`);
    return null;
  }
});

// Setup effects
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
