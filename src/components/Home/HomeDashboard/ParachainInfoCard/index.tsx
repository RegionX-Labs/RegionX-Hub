'use client';

import { useEffect, useState } from 'react';
import styles from './ParachainInfoCard.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { $parachains, parachainsRequested } from '@/parachains';
import { chainData } from '@/chaindata';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import Identicon from '@polkadot/react-identicon';
import { blake2AsHex } from '@polkadot/util-crypto';
import { ParaStateCard, ParaState, paraStateProperties } from '@/components/ParaStateCard';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
} from '@/coretime/renewals';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import { $selectedAccount } from '@/wallet';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';
import { timesliceToTimestamp, toUnitFormatted } from '@/utils';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import TransactionModal from '@/components/TransactionModal';
import toast, { Toaster } from 'react-hot-toast';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';

type Props = {
  onSelectParaId?: (id: string) => void;
  initialParaId?: string;
};

export default function ParachainInfoCard({ onSelectParaId, initialParaId }: Props) {
  const [selected, setSelected] = useState<any | null>(null);
  const [hasSetInitial, setHasSetInitial] = useState(false);
  const [renewalEntry, setRenewalEntry] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [deadline, setDeadline] = useState<string>('-');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [network, connections]);

  useEffect(() => {
    if (hasSetInitial || parachains.length === 0 || !potentialRenewals || !saleInfo) return;

    const match = parachains.find((p) => `${p.id}` === initialParaId && p.network === network);
    if (match) {
      setSelected(match);
      onSelectParaId?.(match.id.toString());
    } else {
      const fallback = parachains.find((p) => p.network === network);
      if (fallback) {
        setSelected(fallback);
        onSelectParaId?.(fallback.id.toString());
      }
    }

    setHasSetInitial(true);
  }, [parachains, potentialRenewals, saleInfo, network, initialParaId, hasSetInitial]);

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
      if (!renewalEntry) return setDeadline('-');
      const [key] = renewalEntry;
      const ts = await timesliceToTimestamp(key.when, network, connections);
      const date = typeof ts === 'bigint' ? new Date(Number(ts)) : ts;
      if (!date || !(date instanceof Date)) return setDeadline('-');
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
  }, [renewalEntry]);

  const paraId = selected?.id;
  const state: ParaState | undefined = selected?.state;
  const chain = paraId !== undefined ? chainData[network]?.[paraId] : null;
  const name = chain?.name || `Parachain ${paraId}`;
  const logoSrc = chain?.logo;
  const homepage = chain?.homepage || '';

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

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.renew({
      core: key.core,
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
          if (ev.ok) {
            toast.success('Renewal successful', { id: toastId });
            getAccountData({ account: selectedAccount.address, connections, network });
          } else {
            toast.error('Transaction failed', { id: toastId });
          }
        }
      },
      (e) => {
        toast.error('Transaction error', { id: toastId });
        console.error(e);
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

  const selectOptions: SelectOption<any>[] = parachains
    .filter((p) => p.network === network)
    .map((item) => {
      const meta = chainData[network]?.[item.id];
      const name = meta?.name || `Parachain ${item.id}`;
      const logo = meta?.logo;

      const renewalMatch = Array.from(potentialRenewals.entries()).find(
        ([key, record]) =>
          (record.completion as any)?.value?.[0]?.assignment?.value === item.id &&
          saleInfo?.regionBegin === key.when
      );

      const renewalStatus = renewalMatch ? 'Needs Renewal' : 'Renewed';
      const badgeColor = renewalMatch ? '#dc2626' : '#0cc184';

      return {
        key: item.id.toString(),
        value: item,
        label: name,
        icon: logo ? (
          <img
            src={logo}
            alt='logo'
            style={{ width: 24, height: 24, borderRadius: '100%', marginRight: 8 }}
          />
        ) : (
          <Identicon
            value={blake2AsHex(`${network}-${item.id}`, 256)}
            size={24}
            theme='substrate'
            style={{ marginRight: 8 }}
          />
        ),
        extra: (
          <span
            style={{
              backgroundColor: badgeColor,
              color: 'black',
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
            }}
          >
            {renewalStatus}
          </span>
        ),
      };
    });

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {selected ? (
          <div className={styles.infoBox}>
            {logo}
            <div className={styles.infoText}>
              <div className={styles.name}>{name}</div>
              <div className={styles.paraId}>Para ID: {paraId}</div>
              {homepage && (
                <a
                  href={homepage}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.siteLink}
                >
                  {homepage}
                </a>
              )}
            </div>
          </div>
        ) : (
          <p></p>
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

      {renewalEntry && (
        <div className={styles.renewRow}>
          <button className={styles.renewButtonSmall} onClick={openModal}>
            Renew
          </button>
          <div className={styles.renewInfo}>
            <span className={styles.renewLabel}>
              {toUnitFormatted(network, BigInt(renewalEntry[1].price))}
            </span>
            <span className={styles.renewLabel}>{deadline}</span>
          </div>
        </div>
      )}

      {selected && (
        <div className={styles.inputSection}>
          <label>Select Parachain</label>
          <Select
            options={selectOptions}
            selectedValue={selected}
            onChange={(value) => {
              setSelected(value);
              onSelectParaId?.(value.id.toString());
            }}
            variant='secondary'
          />
        </div>
      )}

      {selectedAccount && accountData[selectedAccount.address] && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onModalConfirm}
        />
      )}

      <Toaster />
    </div>
  );
}
