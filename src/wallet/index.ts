import { createEffect, createEvent, createStore, sample, scopeBind } from 'effector';
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedExtension,
  InjectedPolkadotAccount,
} from "polkadot-api/pjs-signer"

// TODO: add tests

export const getExtensions = createEvent();
export const walletSelected = createEvent<string>();
export const accountSelected = createEvent<string>();

type WalletExtension = {
    name: string;
}
export const $walletExtensions = createStore<WalletExtension[]>([]);
export const $loadedAccounts = createStore<InjectedPolkadotAccount[]>([]);
export const $selectedAccount = createStore<InjectedPolkadotAccount | null>(null);

const getExtensionsFx = createEffect((): WalletExtension[] => {
    const extensions: string[] = getInjectedExtensions();
    console.log(extensions);
    return extensions.map(e => ({name: e}));
});

const walletSelectedFx = createEffect(async (extension: string): Promise<InjectedPolkadotAccount[]> => {
    const selectedExtension: InjectedExtension = await connectInjectedExtension(
        extension,
    );

    return selectedExtension.getAccounts();
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
    clock: getExtensionsFx.doneData,
    fn: (extensions) => extensions[0].name,
    target: walletSelected,
});

sample({
    clock: walletSelected,
    target: walletSelectedFx,
});

sample({
    clock: walletSelectedFx.doneData,
    target: $loadedAccounts,
});

sample({
    clock: walletSelectedFx.doneData,
    fn: (accounts) => accounts[0],
    target: $selectedAccount,
});

sample({
    clock: accountSelected,
    source: $loadedAccounts,
    fn: (accounts, selectedAcc) => accounts.find(a => a.address === selectedAcc) || null,
    target: $selectedAccount,
});
