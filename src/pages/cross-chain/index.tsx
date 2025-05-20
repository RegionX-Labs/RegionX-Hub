import React, { useState } from 'react';
import styles from './cross-chain.module.scss';
import AddressInput from '../../components/elements/AdressInput/AddressInput';
import Button from '../../components/elements/Button/Button';
import TransactionModal from '@/components/TransactionModal';

import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { ChainId, chains } from '@/network/chains';
import { isHex } from '@polkadot/util';
import { validateAddress } from '@polkadot/util-crypto';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';
import { $selectedAccount } from '@/wallet';
import {
  XcmV3Junction,
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedAssets,
  XcmVersionedLocation,
} from '@polkadot-api/descriptors';
import { AccountId, Binary } from 'polkadot-api';
import { CORETIME_PARA_ID, fromUnit } from '@/utils';
import { $accountData, MultiChainAccountData } from '@/account';
import ChainSelector from '@/components/CrossChain/ChainSelector';
import CrossChainAmountInput from '@/components/CrossChain/AmountInput';

const CrossChain = () => {
  const connections = useUnit($connections);
  const network = useUnit($network);
  const selectedAccount = useUnit($selectedAccount);
  const accountData = useUnit($accountData);

  const [originChain, setOriginChain] = useState<ChainId | null>(null);
  const [destinationChain, setDestinationChain] = useState<ChainId | null>(null);
  const [amount, setAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOriginChainChange = (value: ChainId | null) => {
    setOriginChain(value);
  };

  const handleDestinationChainChange = (value: ChainId | null) => {
    setDestinationChain(value);
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBeneficiary(value);
    setBeneficiaryError(isValidAddress(value) ? null : 'Invalid address');
  };

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    setIsModalOpen(true);
  };

  const onTransfer = async () => {
    console.log('Transfer initiated with:', {
      originChain,
      destinationChain,
      amount,
      beneficiary,
    });

    if (originChain === destinationChain) {
      toast.error('Origin and destination chains are the same');
      return;
    }

    if (!originChain) {
      toast.error('Origin chain not selected');
      return;
    }

    if (!destinationChain) {
      toast.error('Destination chain not selected');
      return;
    }

    if (isCoretimeChain(originChain)) {
      // Coretime to relay
      await coretimeChainToRelayChain();
    } else {
      // Relay to coretime
      await relayChainToCoretimeChain();
    }
    setIsModalOpen(false);
  };

  const relayChainToCoretimeChain = async () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.relayChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;

    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    try {
      const tx = client.getTypedApi(metadata.relayChain).tx.XcmPallet.limited_teleport_assets({
        dest: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(CORETIME_PARA_ID)),
        }),
        beneficiary: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(beneficiary)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V3([
          {
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, BigInt(amount)) as bigint),
            id: XcmV3MultiassetAssetId.Concrete({ interior: XcmV3Junctions.Here(), parents: 0 }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

      tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe((ev) => {
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed');
            console.log(err);
          } else {
            toast.success('Transaction succeded!');
          }
        }
      });
    } catch (e) {
      toast.error('Transaction cancelled');
      console.log(e);
    }
  };

  const coretimeChainToRelayChain = async () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;

    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    try {
      const tx = client.getTypedApi(metadata.coretimeChain).tx.PolkadotXcm.limited_teleport_assets({
        dest: XcmVersionedLocation.V3({
          parents: 1,
          interior: XcmV3Junctions.Here(),
        }),
        beneficiary: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(beneficiary)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V3([
          {
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, BigInt(amount)) as bigint),
            id: XcmV3MultiassetAssetId.Concrete({ interior: XcmV3Junctions.Here(), parents: 1 }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

      tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe((ev) => {
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed');
            console.log(err);
          } else {
            toast.success('Transaction succeded!');
          }
        }
      });
    } catch (e) {
      toast.error('Transaction cancelled');
      console.log(e);
    }
  };

  const handleSwapChains = () => {
    setOriginChain(destinationChain);
    setDestinationChain(originChain);
  };

  const isValidAddress = (chainAddress: string, ss58Prefix = 42) => {
    if (isHex(chainAddress)) return false;
    try {
      validateAddress(chainAddress, true, ss58Prefix);
      return true;
    } catch {
      return false;
    }
  };

  const isCoretimeChain = (chainId: string): boolean => {
    return chainId === chains[`${network}Coretime` as keyof typeof chains]?.chainId;
  };

  return (
    <div className={styles.container}>
      <div className={styles.chainSelectionContainer}>
        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Origin chain:</label>
          <ChainSelector selectedValue={originChain} onChange={handleOriginChainChange} />
        </div>

        <div className={styles.swapIcon} onClick={handleSwapChains}>
          ⇅
        </div>

        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Destination chain:</label>
          <ChainSelector selectedValue={destinationChain} onChange={handleDestinationChainChange} />
        </div>
      </div>

      <div className={styles.transferSection}>
        <label>Transfer to</label>
        <div className={styles.beneficiaryInputWrapper}>
          <button
            className={styles.meButton}
            onClick={() => {
              if (selectedAccount?.address) {
                setBeneficiary(selectedAccount.address);
                setBeneficiaryError(null);
              }
            }}
          >
            Me
          </button>
          <AddressInput
            onChange={handleBeneficiaryChange}
            value={beneficiary}
            placeholder='Address of the recipient'
          />
        </div>

        {beneficiaryError && <p className={styles.errorText}>{beneficiaryError}</p>}

        <div className={styles.amountSection}>
          <label>Transfer Amount:</label>
          <CrossChainAmountInput originChain={originChain} setAmount={setAmount} />
        </div>
      </div>
      {selectedAccount && accountData[selectedAccount.address] !== null && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onTransfer}
        />
      )}

      <div className={styles.buttonContainer}>
        <Button onClick={openModal}>Transfer</Button>
      </div>
      <Toaster />
    </div>
  );
};

export default CrossChain;
