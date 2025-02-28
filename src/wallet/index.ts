import { createEffect, createEvent, createStore, sample, scopeBind } from 'effector';
import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedExtension,
} from "polkadot-api/pjs-signer"

// TODO: add tests

export const getExtensions = createEvent();
export const walletSelected = createEvent<string>();

type WalletExtension = {
    name: string;
}
export const $walletExtensions = createStore<WalletExtension[]>([]);

const getExtensionsFx = createEffect((): WalletExtension[] => {
    const extensions: string[] = getInjectedExtensions();
    console.log(extensions);
    return extensions.map(e => ({name: e}));
});

const walletSelectedFx = createEffect(async (extension: string) => {
    const selectedExtension: InjectedExtension = await connectInjectedExtension(
        extension,
    );

    console.log(selectedExtension.getAccounts());
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

// export const $network = createStore<Network>(Network.POLKADOT);

// const getChainsFx = createEffect((_network: Network): Record<ChainId, Chain> => {
//   const _chains: Record<ChainId, Chain> = Object.fromEntries(
//     Object.entries(chains).map(([_key, chain]) => [chain.chainId, chain])
//   );

//   return _chains;
// });


