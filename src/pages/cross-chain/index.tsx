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
import { CORETIME_PARA_ID, fromUnit, REGIONX_KUSAMA_PARA_ID, toUnitFormatted } from '@/utils';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';
import ChainSelector from '@/components/CrossChain/ChainSelector';
import CrossChainAmountInput from '@/components/CrossChain/AmountInput';
import { SUBSCAN_CORETIME_URL, SUBSCAN_RELAY_URL } from '../coretime/sale-history';

const CrossChain = () => {
  const [originChain, setOriginChain] = useState<ChainId | null>(null);
  const [destinationChain, setDestinationChain] = useState<ChainId | null>(null);
  const [amount, setAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [network, selectedAccount, accountDataMap] = useUnit([
    $network,
    $selectedAccount,
    $accountData,
  ]);
  const connections = useUnit($connections);

  const accountData = selectedAccount?.address ? accountDataMap[selectedAccount.address] : null;
  const formattedRelay =
    accountData?.relayChainData?.free != null
      ? toUnitFormatted(network, accountData.relayChainData.free)
      : '--';

  const formattedCoretime =
    accountData?.coretimeChainData?.free != null
      ? toUnitFormatted(network, accountData.coretimeChainData.free)
      : '--';

  const formattedRegionx =
    network === 'kusama' && accountData?.regionxChainData?.free != null
      ? toUnitFormatted(network, accountData.regionxChainData.free)
      : '--';

  const openModal = () => {
    if (!selectedAccount) return toast.error('Account not selected');
    if (originChain === destinationChain)
      return toast.error('Origin and destination chains are the same');
    if (!originChain || !destinationChain) return toast.error('Both chains must be selected');
    setIsModalOpen(true);
  };

  const onTransfer = async () => {
    if (!originChain || !destinationChain || !selectedAccount) return;
    if (originChain === destinationChain)
      return toast.error('Origin and destination chains are the same');
    if (isCoretimeChain(originChain) && isRelayChain(destinationChain)) {
      await coretimeChainToRelayChain();
    } else if (isRelayChain(originChain) && isCoretimeChain(destinationChain)) {
      await relayChainToCoretimeChain();
    } else if (isRelayChain(originChain) && isRegionXChain(destinationChain)) {
      await relayChainToRegionXChain();
    } else if (isRegionXChain(originChain) && isRelayChain(destinationChain)) {
      await regionXChainToRelayChain();
    } else {
      toast.error('Transfer not supported');
    }
    setIsModalOpen(false);
  };

  const relayChainToCoretimeChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');
    const connection = connections[networkChainIds.relayChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata) return toast.error('Connection or metadata missing');

    if (
      accountData &&
      accountData.relayChainData.free < BigInt(fromUnit(network, Number(amount)))
    ) {
      toast.error('Insufficient balance');
      return;
    }

    const tx = connection.client
      .getTypedApi(metadata.relayChain)
      .tx.XcmPallet.limited_teleport_assets({
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
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, Number(amount))),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.Here(),
              parents: 0,
            }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(
          <span>
            Transaction submitted:&nbsp;
            <a
              href={`${SUBSCAN_RELAY_URL[network]}/extrinsic/${ev.txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: 'underline', color: '#60a5fa' }}
            >
              view transaction
            </a>
          </span>,
          { id: toastId }
        );
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else toast.success('Transaction succeeded!', { id: toastId });
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
  };

  const coretimeChainToRelayChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');
    const connection = connections[networkChainIds.coretimeChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata) return toast.error('Connection or metadata missing');

    if (
      accountData &&
      accountData.coretimeChainData.free < BigInt(fromUnit(network, Number(amount)))
    ) {
      toast.error('Insufficient balance');
      return;
    }

    const tx = connection.client
      .getTypedApi(metadata.coretimeChain)
      .tx.PolkadotXcm.limited_teleport_assets({
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
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, Number(amount))),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.Here(),
              parents: 1,
            }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(
          <span>
            Transaction submitted:&nbsp;
            <a
              href={`${SUBSCAN_CORETIME_URL[network]}/extrinsic/${ev.txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: 'underline', color: '#60a5fa' }}
            >
              view transaction
            </a>
          </span>,
          { id: toastId }
        );
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else {
            toast.success('Transaction succeeded!', { id: toastId });
            getAccountData({ account: selectedAccount.address, connections, network });
          }
        }
      },
      (e) => toast.error('Transaction cancelled', { id: toastId })
    );
  };

  const relayChainToRegionXChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');
    const connection = connections[networkChainIds.relayChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata) return toast.error('Connection or metadata missing');

    const tx = connection.client
      .getTypedApi(metadata.relayChain)
      .tx.XcmPallet.limited_reserve_transfer_assets({
        dest: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(REGIONX_KUSAMA_PARA_ID)),
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
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, Number(amount))),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.Here(),
              parents: 0,
            }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(
          <span>
            Transaction submitted:&nbsp;
            <a
              href={`${SUBSCAN_RELAY_URL[network]}/extrinsic/${ev.txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: 'underline', color: '#60a5fa' }}
            >
              view transaction
            </a>
          </span>,
          { id: toastId }
        );
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else toast.success('Transaction succeeded!', { id: toastId });
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
  };

  const regionXChainToRelayChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds || !networkChainIds.regionxChain) return toast.error('Unknown network');
    const connection = connections[networkChainIds.regionxChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata || !metadata.regionxChain)
      return toast.error('Connection or metadata missing');

    const tx = connection.client
      .getTypedApi(metadata.regionxChain)
      .tx.PolkadotXcm.limited_reserve_transfer_assets({
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
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, Number(amount))),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.Here(),
              parents: 1,
            }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(
          // TODO: we are not on subscan.
          <span>Transaction submitted</span>,
          { id: toastId }
        );
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else {
            toast.success('Transaction succeeded!', { id: toastId });
            getAccountData({ account: selectedAccount.address, connections, network });
          }
        }
      },
      (e) => toast.error('Transaction cancelled', { id: toastId })
    );
  };

  const handleSwapChains = () => {
    setOriginChain(destinationChain);
    setDestinationChain(originChain);
  };

  const isValidAddress = (addr: string, ss58Prefix = 42) => {
    if (isHex(addr)) return false;
    try {
      validateAddress(addr, true, ss58Prefix);
      return true;
    } catch {
      return false;
    }
  };

  const isRelayChain = (chainId: string): boolean => {
    return chainId === chains[`${network}` as keyof typeof chains]?.chainId;
  };
  const isCoretimeChain = (chainId: string): boolean => {
    return chainId === chains[`${network}Coretime` as keyof typeof chains]?.chainId;
  };
  const isRegionXChain = (chainId: string): boolean => {
    const capitalize = (str: string): string => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return chainId === chains[`regionx${capitalize(network)}` as keyof typeof chains]?.chainId;
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBeneficiary(value);
    setBeneficiaryError(isValidAddress(value) ? null : 'Invalid address');
  };

  return (
    <div className={styles.container}>
      <div className={styles.chainSelectionContainer}>
        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Origin chain:</label>
          <ChainSelector selectedValue={originChain} onChange={setOriginChain} />
        </div>

        <div className={styles.swapIcon} onClick={handleSwapChains}>
          ⇅
        </div>

        <div className={styles.chainSelection}>
          <label className={styles.sectionLabel}>Destination chain:</label>
          <ChainSelector selectedValue={destinationChain} onChange={setDestinationChain} />
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
            value={beneficiary}
            onChange={handleBeneficiaryChange}
            placeholder='Address of the recipient'
          />
        </div>
        {beneficiaryError && <p className={styles.errorText}>{beneficiaryError}</p>}

        <div className={styles.amountSection}>
          <label>Transfer Amount:</label>
          <div className={styles.amountInputWrapper}>
            <CrossChainAmountInput originChain={originChain} setAmount={setAmount} />
          </div>
        </div>
      </div>

      {selectedAccount && accountDataMap[selectedAccount.address] && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountDataMap[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onTransfer}
        />
      )}
      {selectedAccount && accountData && (
        <div className={styles.balanceBox}>
          <div className={styles.balanceItem}>
            <span className={styles.label}>Relay Chain Balance</span>
            <span className={styles.value}>{formattedRelay}</span>
          </div>
          <div className={styles.balanceItem}>
            <span className={styles.label}>Coretime Chain Balance</span>
            <span className={styles.value}>{formattedCoretime}</span>
          </div>
          {network === 'kusama' && (
            <div className={`${styles.balanceItem} ${styles.alignRight}`}>
              <span className={styles.label}>RegionX Chain Balance</span>
              <span className={styles.value}>{formattedRegionx}</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.buttonContainer}>
        <Button onClick={openModal}>Transfer</Button>
      </div>
      <Toaster />
    </div>
  );
};

export default CrossChain;
