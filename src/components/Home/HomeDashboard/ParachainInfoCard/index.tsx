'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './ParachainInfoCard.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { $parachains, getParaCoreId, parachainsRequested } from '@/parachains';
import { chainData } from '@/chaindata';
import Identicon from '@polkadot/react-identicon';
import { blake2AsHex } from '@polkadot/util-crypto';
import { ParaStateCard, ParaState, paraStateProperties } from '@/components/ParaStateCard';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
  fetchAutoRenewals,
} from '@/coretime/renewals';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import { $selectedAccount } from '@/wallet';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';
import { timesliceToTimestamp, toUnitFormatted } from '@/utils';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import TransactionModal from '@/components/TransactionModal';
import toast, { Toaster } from 'react-hot-toast';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';
import AutoRenewalModal from '@/components/AutoRenewalModal';
import { ParachainSelect } from './ParachainSelect';

type Props = {
  onSelectParaId: (id: string) => void;
  initialParaId?: string;
};

export default function ParachainInfoCard({ onSelectParaId, initialParaId }: Props) {
  const [selected, setSelected] = useState<any | null>(null);
  const [hasSetInitial, setHasSetInitial] = useState(false);
  const [renewalEntry, setRenewalEntry] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [deadline, setDeadline] = useState<string>('-');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoRenewOpen, setIsAutoRenewOpen] = useState(false);
  const [autoRenewSet, setAutoRenewSet] = useState<Set<number>>(new Set());

  const [
    network,
    connections,
    parachains,
    potentialRenewals,
    saleInfo,
    selectedAccount,
    accountData,
  ] = useUnit([
    $network,
    $connections,
    $parachains,
    $potentialRenewals,
    $latestSaleInfo,
    $selectedAccount,
    $accountData,
  ]);

  useEffect(() => {
    parachainsRequested(network);
    potentialRenewalsRequested({ network, connections });
    void refreshAutoRenewals();
  }, [network, connections]);

  const refreshAutoRenewals = async () => {
    try {
      const list = await fetchAutoRenewals(network, connections);
      const set = new Set<number>(list.map((e: any) => Number(e.task)));
      setAutoRenewSet(set);
    } catch {}
  };

  useEffect(() => {
    if (!isAutoRenewOpen) {
      void refreshAutoRenewals();
    }
  }, [isAutoRenewOpen]);

  useEffect(() => {
    if (parachains.length === 0 || !potentialRenewals || !saleInfo) return;

    const selectedIsForNetwork = selected?.network === network;
    const urlMatch =
      initialParaId && parachains.find((p) => `${p.id}` === initialParaId && p.network === network);

    if (!hasSetInitial || !selectedIsForNetwork) {
      if (urlMatch) {
        setSelected(urlMatch);
        onSelectParaId?.(urlMatch.id.toString());
      } else {
        const fallback = parachains.find((p) => p.network === network);
        setSelected(fallback ?? null);
        if (fallback) onSelectParaId?.(fallback.id.toString());
      }
      setHasSetInitial(true);
    }
  }, [
    network,
    parachains,
    potentialRenewals,
    saleInfo,
    initialParaId,
    hasSetInitial,
    selected?.network,
    onSelectParaId,
  ]);

  useEffect(() => {
    if (!saleInfo || !selected) return;
    const match = Array.from(potentialRenewals.entries()).find(
      ([key, record]) =>
        (record.completion as any)?.value?.[0]?.assignment?.value === selected.id &&
        saleInfo.regionBegin === key.when
    );
    setRenewalEntry(match ?? null);
  }, [potentialRenewals, selected, saleInfo]);

  useEffect(() => {
    (async () => {
      if (!renewalEntry) {
        setDeadline('-');
        return;
      }
      const [key] = renewalEntry;
      const ts = await timesliceToTimestamp(key.when, network, connections);
      const date = typeof ts === 'bigint' ? new Date(Number(ts)) : ts;
      if (!date || !(date instanceof Date)) {
        setDeadline('-');
        return;
      }
      setDeadline(
        date.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    })();
  }, [renewalEntry, network, connections]);

  const paraId = selected?.id as number | undefined;
  const state: ParaState | undefined = selected?.state;
  const chain = paraId !== undefined ? chainData[network]?.[paraId] : null;
  const name = chain?.name || (paraId !== undefined ? `Parachain ${paraId}` : 'Parachain');
  const logoSrc = (chain?.logo as string | undefined) || undefined;

  const pickSolid = (c?: string) => {
    if (!c) return undefined;
    if (c.includes('gradient')) {
      const m = c.match(/#([0-9a-fA-F]{3,8})|rgba?\([^)]+\)/);
      return m?.[0] || undefined;
    }
    return c;
  };
  const solidAccent = pickSolid((chain as any)?.color);

  const openModal = () => {
    if (!selectedAccount) return toast.error('Account not selected');
    if (!renewalEntry) return toast.error('No renewal available');
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    if (!renewalEntry || !selectedAccount) return;
    const [key] = renewalEntry;

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');

    const connection = connections[networkChainIds.coretimeChain];
    const client = connection?.client;
    const metadata = getNetworkMetadata(network);
    if (!client || !metadata) return toast.error('API error');

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.renew({ core: key.core });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev: any) => {
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
          if (ev.ok) {
            toast.success('Renewal successful', { id: toastId });
            getAccountData({ account: selectedAccount.address, connections, network });
          } else {
            toast.error('Transaction failed', { id: toastId });
          }
        }
      },
      () => {
        toast.error('Transaction error', { id: toastId });
      }
    );

    setIsModalOpen(false);
  };

  const logo = logoSrc ? (
    <img src={logoSrc} alt='logo' className={styles.largeLogo} />
  ) : (
    <Identicon
      value={blake2AsHex(`${network}-${paraId}`, 256)}
      size={48}
      theme='substrate'
      className={styles.largeLogo}
    />
  );

  const autoRenewEnabled = useMemo(() => {
    if (!selected?.id) return false;
    return autoRenewSet.has(Number(selected.id));
  }, [autoRenewSet, selected?.id]);

  const dateTitle = renewalEntry ? 'Renewal deadline' : 'End of sale cycle';

  return (
    <div
      className={styles.card}
      style={solidAccent ? { borderColor: solidAccent, borderWidth: '1px' } : undefined}
    >
      <div className={styles.content}>
        {selected ? (
          <div className={styles.infoBox}>
            {logo}
            <div className={styles.infoText}>
              <div className={styles.name}>{name}</div>
              <div className={styles.paraId}>Para ID: {paraId}</div>
              {chain?.homepage && (
                <a
                  href={chain.homepage}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.siteLink}
                >
                  {chain.homepage}
                </a>
              )}
            </div>
          </div>
        ) : (
          <p />
        )}

        {typeof state === 'number' && (
          <div className={styles.stateTooltip}>
            <ParaStateCard
              state={state}
              withTooltip={state === ParaState.SYSTEM}
              renewalStatus={
                state !== ParaState.SYSTEM ? (renewalEntry ? 'needed' : 'done') : undefined
              }
            />
            <div className={styles.stateText}>
              {(() => {
                if (state === ParaState.SYSTEM) {
                  return paraStateProperties[state]?.description;
                }
                const renewalStatus = renewalEntry ? 'needed' : 'done';
                if (renewalStatus === 'done') {
                  return 'This parachain has renewed the core on time and doesn’t need to do anything until the beginning of the next sale cycle.';
                }
                if (renewalStatus === 'needed') {
                  return 'This parachain needs to renew the core, otherwise it may stop if not renewed on time.';
                }
                return paraStateProperties[state]?.description;
              })()}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ParachainSelect
          onSelectParaId={onSelectParaId}
          selected={selected}
          setSelected={setSelected}
        />
      )}

      {renewalEntry && (
        <div className={styles.summaryRow}>
          <div className={styles.priceBox}>
            <span className={styles.priceLabel}>Renewal Price</span>
            <span className={styles.priceValue}>
              {toUnitFormatted(network, BigInt(renewalEntry[1].price))}
            </span>
          </div>
          <div className={styles.dateWrap}>
            <span className={styles.dateTitle}>{dateTitle}</span>
            <span className={styles.dateValue}>{deadline}</span>
          </div>
        </div>
      )}

      <div className={styles.actionRow}>
        <div className={styles.leftAction}>
          {renewalEntry && (
            <button className={styles.renewButton} onClick={openModal}>
              Renew
            </button>
          )}
        </div>
        <div className={styles.rightAction}>
          {state !== ParaState.SYSTEM && selected && (
            <button
              className={
                autoRenewEnabled
                  ? `${styles.autoRenewBtn} ${styles.autoRenewBtnEnabled}`
                  : styles.autoRenewBtn
              }
              onClick={() => setIsAutoRenewOpen(true)}
            >
              {autoRenewEnabled ? 'Auto-Renewal Enabled' : 'Enable Auto-Renewal'}
            </button>
          )}
        </div>
      </div>

      {selectedAccount && accountData[selectedAccount.address] && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onModalConfirm}
        />
      )}

      {renewalEntry && paraId && (
        <AutoRenewalModal
          isOpen={isAutoRenewOpen}
          onClose={() => setIsAutoRenewOpen(false)}
          paraId={paraId}
          coreId={renewalEntry[0].core}
        />
      )}

      <Toaster />
    </div>
  );
}
