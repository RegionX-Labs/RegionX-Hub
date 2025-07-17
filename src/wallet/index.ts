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
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

type WalletExtension = {
  name: string;
};

export const $walletExtensions = createStore<WalletExtension[]>([]);
export const $loadedAccounts = createStore<InjectedPolkadotAccount[]>([]);
export const $selectedAccount = createStore<InjectedPolkadotAccount | null>(null);

const getExtensionsFx = createEffect(async (): Promise<WalletExtension[]> => {
  const extensions: string[] = getInjectedExtensions();

  // Try to connect mimir
  const origin = await isMimirReady();

  // Verify if the URL matches Mimir's pattern
  if (origin && MIMIR_REGEXP.test(origin)) {
    // Inject Mimir into window.injectedWeb3
    inject();
    // Now you can use polkadot extension functions
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
    if (!extension) return [];
    const realExtension = extension === 'nova' ? 'polkadot-js' : extension;
    const selectedExtension: InjectedExtension = await connectInjectedExtension(realExtension);
    return selectedExtension.getAccounts();
  }
);

const restoreAccountFx = createEffect(async (): Promise<InjectedPolkadotAccount | null> => {
  const selectedWallet = localStorage.getItem(SELECTED_WALLET_KEY);
  const selectedAccount = localStorage.getItem(SELECTED_ACCOUNT_KEY);
  if (!selectedWallet || !selectedAccount) return null;

  const realExtension = selectedWallet === 'nova' ? 'polkadot-js' : selectedWallet;
  const extension = await connectInjectedExtension(realExtension);
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
