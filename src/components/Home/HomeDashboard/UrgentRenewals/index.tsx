'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import styles from './UrgentRenewals.module.scss';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
  fetchAutoRenewals,
} from '@/coretime/renewals';
import { timesliceToTimestamp, toUnitFormatted } from '@/utils';
import { chainData } from '@/chaindata';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';
import { $latestSaleInfo, $phaseEndpoints } from '@/coretime/saleInfo';
import { $selectedAccount } from '@/wallet';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';
import TransactionModal from '@/components/TransactionModal';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';
import AutoRenewalModal from '@/components/AutoRenewalModal';

type Props = { view: string };

const formatDate = (d: Date) =>
  d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function UrgentRenewals({ view }: Props) {
  const [
    accountData,
    network,
    connections,
    selectedAccount,
    saleInfo,
    phaseEndpoints,
    potentialRenewals,
  ] = useUnit([
    $accountData,
    $network,
    $connections,
    $selectedAccount,
    $latestSaleInfo,
    $phaseEndpoints,
    $potentialRenewals,
  ]);

  const [selected, setSelected] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>('-');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoRenewOpen, setIsAutoRenewOpen] = useState(false);
  const [autoRenewSet, setAutoRenewSet] = useState<Set<number>>(new Set());

  // ---- helpers ----

  const refreshAutoRenewals = useCallback(async () => {
    try {
      const list = await fetchAutoRenewals(network, connections);
      const set = new Set<number>(list.map((e: any) => Number(e.task)));
      setAutoRenewSet(set);
    } catch {
      // swallow – we just don't show auto-renew info
    }
  }, [network, connections]);

  const getParaIdFromRecord = (record: RenewalRecord | undefined | null): number | null => {
    if (!record) return null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (record.completion as any)?.value?.[0]?.assignment?.value ?? null;
    } catch {
      return null;
    }
  };

  const soldOutMessage =
    'Sold out—no further purchases or renewals this sale cycle. Check the secondary market for potential purchases.';

  const ensureCanRenew = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return false;
    }
    if (!saleInfo) {
      toast.error('Sale info unavailable');
      return false;
    }
    if (allCoresSold) {
      toast.error(soldOutMessage);
      return false;
    }
    return true;
  };

  // ---- data derived from stores ----

  const interludeEndDate = useMemo(() => {
    if (!phaseEndpoints?.interlude?.end) return null;
    return new Date(phaseEndpoints.interlude.end);
  }, [phaseEndpoints]);

  const interludeEnded = useMemo(() => {
    if (!phaseEndpoints?.interlude?.end) return false;
    return Date.now() >= phaseEndpoints.interlude.end;
  }, [phaseEndpoints]);

  const allCoresSold = useMemo(
    () =>
      (saleInfo?.coresSold ?? 0) >= (saleInfo?.coresOffered ?? 0),
    [saleInfo]
  );

  const bannerMsg = useMemo(() => {
    if (allCoresSold) return soldOutMessage;
    if (interludeEnded)
      return 'The sale is ongoing; you won’t be able to renew if all cores are sold.';
    return null;
  }, [allCoresSold, interludeEnded]);

  const options: SelectOption<[RenewalKey, RenewalRecord]>[] = useMemo(() => {
    if (!saleInfo) return [];

    const { regionBegin, regionEnd } = saleInfo;
    if (!regionBegin || !regionEnd) return [];

    const entries = Array.from(potentialRenewals.entries());

    const hasRenewalAt = (when: number, paraId: number) =>
      entries.some(([key, record]) => {
        if (key.when !== when) return false;
        const recParaId = getParaIdFromRecord(record);
        return recParaId === paraId;
      });

    return entries
      .filter(([key]) => key.when === regionBegin)
      .flatMap(([key, record]) => {
        const paraId = getParaIdFromRecord(record);
        if (typeof paraId !== 'number') return [];

        const meta = chainData[network]?.[paraId];
        const name = meta?.name ?? `Parachain ${paraId}`;
        const logo = meta?.logo as string | undefined;

        const renewForNext = hasRenewalAt(regionEnd, paraId);
        const renewForCurrent = hasRenewalAt(regionBegin, paraId);
        const requiresRenewal = !renewForNext && renewForCurrent;

        if (!requiresRenewal) return [];

        const renewalStatus = 'Needs renewal';
        const badgeColor = '#dc2626';

        return {
          key: `${key.when}-${key.core}`,
          label: ` ${name} | Core ${key.core} `,
          value: [key, record] as [RenewalKey, RenewalRecord],
          icon: logo ? (
            <img
              style={{ width: 28, height: 28, borderRadius: '100%', marginRight: 8 }}
              src={logo}
            />
          ) : undefined,
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
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [saleInfo, potentialRenewals, network]);

  const hasRenewables = options.length > 0;

  const paraId = useMemo(() => {
    return selected?.[1] ? getParaIdFromRecord(selected[1]) : null;
  }, [selected]);

  const autoRenewEnabled = useMemo(
    () => (typeof paraId === 'number' ? autoRenewSet.has(paraId) : false),
    [autoRenewSet, paraId]
  );

  const disableRenew = !selectedAccount || !selected || allCoresSold;
  const disableAutoRenew = !selectedAccount || typeof paraId !== 'number';

  // ---- effects ----

  // initial fetch
  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
    void refreshAutoRenewals();
  }, [network, connections, refreshAutoRenewals]);

  // refresh auto-renew when the modal closes
  useEffect(() => {
    if (!isAutoRenewOpen) void refreshAutoRenewals();
  }, [isAutoRenewOpen, refreshAutoRenewals]);

  // default selected option when options list changes
  useEffect(() => {
    if (options[0]) setSelected(options[0].value);
    else setSelected(null);
  }, [options]);

  // deadline for selected core
  useEffect(() => {
    (async () => {
      if (!selected) {
        setSelectedDeadline('-');
        return;
      }

      const deadline = await timesliceToTimestamp(selected[0].when, network, connections);
      if (!deadline) {
        setSelectedDeadline('-');
        return;
      }

      const date =
        typeof deadline === 'bigint' ? new Date(Number(deadline)) : (deadline as Date);

      setSelectedDeadline(formatDate(date));
    })();
  }, [selected, network, connections]);

  // ---- actions ----

  const openModal = () => {
    if (!ensureCanRenew()) return;
    setIsModalOpen(true);
  };

  const renew = useCallback(async () => {
    if (!selected) return toast.error('Core not selected');
    if (!ensureCanRenew()) return;

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');

    const connection = connections[networkChainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      return toast.error('Failed to connect to the API');
    }

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata) return toast.error('Failed to find metadata of the chains');

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.renew({
      core: selected[0].core,
    });

    const toastId = toast.loading('Transaction submitted');

    tx.signSubmitAndWatch(selectedAccount!.polkadotSigner).subscribe(
      (ev: any) => {
        toast.loading(
          <span>
            Transaction submitted:&nbsp;
            <a
              href={`${SUBSCAN_CORETIME_URL[network]}/extrinsic/${ev.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#60a5fa' }}
            >
              view transaction
            </a>
          </span>,
          { id: toastId }
        );

        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            toast.error('Transaction failed', { id: toastId });
          } else {
            toast.success('Transaction succeeded!', { id: toastId });
            getAccountData({ account: selectedAccount!.address, connections, network });
          }
        }
      },
      () => {
        toast.error('Transaction cancelled', { id: toastId });
      }
    );
  }, [selected, ensureCanRenew, network, connections, selectedAccount]);

  const onModalConfirm = async () => {
    await renew();
    setIsModalOpen(false);
  };

  const handleOpenAutoRenew = () => {
    if (disableAutoRenew) return;
    setIsAutoRenewOpen(true);
  };

  // ---- render ----

  return (
    <div
      className={`${styles.renewableCoresCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <div className={styles.content}>
        <p className={styles.title}>Urgent Renewals</p>

        <div className={styles.selectBox}>
          {hasRenewables ? (
            <Select
              options={options}
              selectedValue={selected}
              onChange={setSelected}
              variant="secondary"
              searchable
              searchPlaceholder="Search parachain"
            />
          ) : (
            <p className={styles.noDataMessage}>
              All cores have been renewed. Nothing left to renew!
            </p>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.detailBlock}>
            <p className={styles.label}>Renewal Price</p>
            <p className={styles.value}>
              {selected ? toUnitFormatted(network, BigInt(selected[1].price)) : '-'}
            </p>
          </div>

          <div className={styles.detailBlock}>
            <p className={styles.label}>Renewal deadline</p>
            <p className={styles.value}>{selectedDeadline}</p>
          </div>
        </div>

        <div className={styles.interludeSection}>
          <p className={styles.interludeHeading}>
            {interludeEnded ? 'Interlude ended' : 'Interlude ends'}
          </p>
          <p className={styles.interludeValue}>
            {interludeEndDate ? formatDate(interludeEndDate) : '-'}
          </p>
        </div>

        {bannerMsg && (
          <div
            className={`${styles.notice} ${
              allCoresSold ? styles.noticeError : styles.noticeWarning
            }`}
          >
            {bannerMsg}
          </div>
        )}
      </div>

      <div className={styles.buttonRow}>
        <button
          className={styles.renewButton}
          onClick={openModal}
          disabled={disableRenew}
          title={disableRenew && allCoresSold ? 'All cores are sold' : undefined}
        >
          Renew Now
        </button>

        {hasRenewables && (
          <button
            className={
              autoRenewEnabled
                ? `${styles.autoRenewButton} ${styles.autoRenewButtonEnabled}`
                : styles.autoRenewButton
            }
            onClick={handleOpenAutoRenew}
            disabled={disableAutoRenew}
            title={
              disableAutoRenew
                ? !selectedAccount
                  ? 'Account not selected'
                  : 'Select a core to manage auto-renewal'
                : undefined
            }
          >
            {autoRenewEnabled ? 'Auto-Renewal Enabled' : 'Enable Auto-Renewal'}
          </button>
        )}
      </div>

      {selectedAccount && accountData[selectedAccount.address] !== null && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onModalConfirm}
        />
      )}

      {selected && (
        <AutoRenewalModal
          isOpen={isAutoRenewOpen}
          onClose={() => setIsAutoRenewOpen(false)}
          paraId={paraId ?? 0}
          coreId={selected[0].core}
        />
      )}
      <Toaster />
    </div>
  );
}
