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
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedAssets,
  XcmVersionedLocation,
} from '@polkadot-api/descriptors';
import { AccountId, Binary } from 'polkadot-api';
import { ASSET_HUB_PARA_ID, CORETIME_PARA_ID, fromUnit, toUnitFormatted } from '@/utils';
import { $accountData, MultiChainAccountData } from '@/account';
import ChainSelector from '@/components/CrossChain/ChainSelector';
import CrossChainAmountInput from '@/components/CrossChain/AmountInput';
import { SUBSCAN_ASSET_HUB_URL, SUBSCAN_CORETIME_URL } from '../coretime/sale-history';

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

  const formattedAh =
    accountData?.ahChainData?.free != null
      ? toUnitFormatted(network, accountData.ahChainData.free)
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
    if (!originChain || !destinationChain) return toast.error('Both chains must be selected');
    if (originChain === destinationChain)
      return toast.error('Origin and destination chains are the same');

    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0)
      return toast.error('Enter a valid amount');

    if (!accountData) return toast.error('Account data unavailable');

    const required = BigInt(fromUnit(network, parsedAmount));
    const originBalance = isAhChain(originChain)
      ? accountData.ahChainData?.free
      : isCoretimeChain(originChain)
        ? accountData.coretimeChainData?.free
        : null;

    if (originBalance == null) return toast.error('Balance unavailable for selected origin chain');
    if (originBalance < required)
      return toast.error(`Insufficient balance on ${getChainLabel(originChain)}`);

    setIsModalOpen(true);
  };

  const onTransfer = async () => {
    if (!originChain || !destinationChain || !selectedAccount) return;
    if (originChain === destinationChain)
      return toast.error('Origin and destination chains are the same');

    if (isAhChain(originChain) && isCoretimeChain(destinationChain)) {
      ahChainToCoretimeChain();
    } else if (isCoretimeChain(originChain) && isAhChain(destinationChain)) {
      coretimeChainToAhChain();
    } else {
      toast.error('Transfer not supported');
    }
    setIsModalOpen(false);
  };

  const ahChainToCoretimeChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds || !networkChainIds.ahChain) return toast.error('Unknown network');
    const connection = connections[networkChainIds.ahChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata || !metadata.ahChain)
      return toast.error('Connection or metadata missing');

    if (
      accountData &&
      accountData.ahChainData &&
      accountData.ahChainData.free < BigInt(fromUnit(network, Number(amount)))
    ) {
      toast.error(`Insufficient balance on ${getChainLabel(originChain)}`);
      return;
    }

    const tx = connection.client
      .getTypedApi(metadata.ahChain)
      .tx.PolkadotXcm.limited_teleport_assets({
        dest: XcmVersionedLocation.V4({
          parents: 1,
          interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(CORETIME_PARA_ID)),
        }),
        beneficiary: XcmVersionedLocation.V4({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(beneficiary)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V4([
          {
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, Number(amount))),
            id: {
              interior: XcmV3Junctions.Here(),
              parents: 1,
            },
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
              href={`${SUBSCAN_ASSET_HUB_URL[network]}/extrinsic/${ev.txHash}`}
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

  const coretimeChainToAhChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds || !networkChainIds.ahChain) return toast.error('Unknown network');
    const connection = connections[networkChainIds.coretimeChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata || !metadata.coretimeChain)
      return toast.error('Connection or metadata missing');

    if (
      accountData &&
      accountData.coretimeChainData &&
      accountData.coretimeChainData.free < BigInt(fromUnit(network, Number(amount)))
    ) {
      toast.error(`Insufficient balance on ${getChainLabel(originChain)}`);
      return;
    }

    const tx = connection.client
      .getTypedApi(metadata.coretimeChain)
      .tx.PolkadotXcm.limited_teleport_assets({
        dest: XcmVersionedLocation.V4({
          parents: 1,
          interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(ASSET_HUB_PARA_ID)),
        }),
        beneficiary: XcmVersionedLocation.V4({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(beneficiary)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V4([
          {
            fun: XcmV3MultiassetFungibility.Fungible(fromUnit(network, Number(amount))),
            id: {
              interior: XcmV3Junctions.Here(),
              parents: 1,
            },
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
          else toast.success('Transaction succeeded!', { id: toastId });
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
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

  const isCoretimeChain = (chainId: string): boolean => {
    return chainId === chains[`${network}Coretime` as keyof typeof chains]?.chainId;
  };
  const isAhChain = (chainId: string): boolean => {
    return chainId === chains[`${network}AH` as keyof typeof chains]?.chainId;
  };
  const getChainLabel = (chainId: ChainId | null): string => {
    if (!chainId) return 'selected chain';
    if (isAhChain(chainId)) return 'Asset Hub';
    if (isCoretimeChain(chainId)) return 'Coretime Chain';
    return 'selected chain';
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBeneficiary(value);
    setBeneficiaryError(isValidAddress(value) ? null : 'Invalid address');
  };

  const getChainName = (chainId: ChainId | null) => {
    if (!chainId) return 'Select chain';
    const match = Object.values(chains).find((chain) => chain.chainId === chainId);
    return match?.name ?? 'Select chain';
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Cross-chain transfer</p>
          <h1>Move tokens to Coretime chain in a few steps</h1>
          <p className={styles.subtitle}>
            Build your route, review fees, and send with a single click.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>Secure teleport</span>
            <span className={styles.badge}>Live status</span>
          </div>
        </div>
        <div className={styles.heroMetrics}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Route status</span>
            <div className={styles.metricValue}>
              <span className={styles.statusDot} /> Operational
            </div>
            <p className={styles.metricHint}>No incidents reported</p>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Typical completion</span>
            <div className={styles.metricValue}>~30s</div>
            <p className={styles.metricHint}>This is a rough estimate</p>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.muted}>Route builder</p>
                <h3>Select origin & destination</h3>
              </div>
              <span className={styles.pill}>XCM Teleport</span>
            </div>
            <div className={styles.chainGrid}>
              <div className={styles.chainBlock}>
                <span className={styles.inputLabel}>Origin chain</span>
                <ChainSelector selectedValue={originChain} onChange={setOriginChain} />
              </div>
              <div className={styles.connector}>
                <button className={styles.swapButton} onClick={handleSwapChains}>
                  <span className={styles.swapIcon}>⇅</span>
                </button>
              </div>
              <div className={styles.chainBlock}>
                <span className={styles.inputLabel}>Destination chain</span>
                <ChainSelector selectedValue={destinationChain} onChange={setDestinationChain} />
              </div>
            </div>
            <div className={styles.helperRow}>
              <span className={styles.helper}>
                Teleport between Asset Hub and Coretime in one hop
              </span>
              <span className={styles.helper}>Fees and limits are shown before send</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.transferCard}`}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.muted}>Recipient & amount</p>
                <h3>Who are you sending to?</h3>
              </div>
              <span className={styles.pillMuted}>Wallet connected</span>
            </div>
            <label className={styles.inputLabel}>Transfer to</label>
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
                My Address
              </button>
              <AddressInput
                value={beneficiary}
                onChange={handleBeneficiaryChange}
                placeholder='Address of the recipient'
              />
            </div>
            {beneficiaryError && <p className={styles.errorText}>{beneficiaryError}</p>}

            <div className={styles.amountSection}>
              <label className={styles.inputLabel}>Transfer amount</label>
              <div className={styles.amountInputWrapper}>
                <CrossChainAmountInput originChain={originChain} setAmount={setAmount} />
              </div>
              <div className={styles.amountHelper}>
                <span>{getChainName(originChain)} balance shown in summary</span>
                <span className={styles.feeNote}>Fees are deducted from the origin chain</span>
              </div>
            </div>
          </div>

          {selectedAccount && accountData && (
            <div className={`${styles.card} ${styles.balanceCard}`}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.muted}>Balances</p>
                  <h3>Available to transfer</h3>
                </div>
              </div>
              <div className={styles.balanceGrid}>
                <div className={styles.balanceItem}>
                  <span className={styles.label}>
                    {accountData.ahChainData ? 'Asset Hub' : 'Relay Chain'}
                  </span>
                  <span className={styles.value}>
                    {accountData.ahChainData ? formattedAh : formattedRelay}
                  </span>
                  <span className={styles.balanceHint}>Origin side</span>
                </div>
                <div className={styles.balanceItem}>
                  <span className={styles.label}>Coretime Chain</span>
                  <span className={styles.value}>{formattedCoretime}</span>
                  <span className={styles.balanceHint}>Destination side</span>
                </div>
                {network === 'kusama' && (
                  <div className={`${styles.balanceItem} ${styles.alignRight}`}>
                    <span className={styles.label}>RegionX Chain</span>
                    <span className={styles.value}>{formattedRegionx}</span>
                    <span className={styles.balanceHint}>Optional</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.muted}>Overview</p>
                <h3>Transfer summary</h3>
              </div>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>From</span>
              <span className={styles.value}>{getChainName(originChain)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>To</span>
              <span className={styles.value}>{getChainName(destinationChain)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Amount</span>
              <span className={styles.value}>{amount || '—'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Estimated fee</span>
              <span className={styles.valueMuted}>Shown on confirm</span>
            </div>
            <div className={styles.tipBox}>
              <p className={styles.tipTitle}>Heads up</p>
              <p className={styles.tipCopy}>
                Keep some balance on the origin chain to cover fees. Review the transaction modal
                before sending.
              </p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.muted}>Status</p>
                <h3>Network health</h3>
              </div>
            </div>
            <div className={styles.statusList}>
              <div className={styles.statusRow}>
                <span className={styles.statusDot} />
                <div>
                  <p className={styles.label}>Asset Hub</p>
                </div>
              </div>
              <div className={styles.statusRow}>
                <span className={styles.statusDot} />
                <div>
                  <p className={styles.label}>Coretime</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.actionBar}>
            <div>
              <p className={styles.muted}>Ready to send?</p>
              <h4>Review and launch your transfer</h4>
            </div>
            <Button onClick={openModal}>Transfer</Button>
          </div>
        </aside>
      </div>

      {selectedAccount && accountDataMap[selectedAccount.address] && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountDataMap[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onTransfer}
        />
      )}
      <Toaster />
    </div>
  );
};

export default CrossChain;
