'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const accountData = useUnit($accountData);
  const network = useUnit($network);
  const connections = useUnit($connections);
  const selectedAccount = useUnit($selectedAccount);
  const saleInfo = useUnit($latestSaleInfo);
  const phaseEndpoints = useUnit($phaseEndpoints);
  const potentialRenewals = useUnit($potentialRenewals);

  const [selected, setSelected] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>('-');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoRenewOpen, setIsAutoRenewOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption<[RenewalKey, RenewalRecord]>[]>([]);
  const [autoRenewSet, setAutoRenewSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
    void refreshAutoRenewals();
  }, [network, connections]);

  const refreshAutoRenewals = async () => {
    try {
      const list = await fetchAutoRenewals(network, connections);
      const set = new Set<number>(list.map((e: any) => Number(e.task)));
      setAutoRenewSet(set);
    } catch {
      /* no-op */
    }
  };

  useEffect(() => {
    if (!isAutoRenewOpen) void refreshAutoRenewals();
  }, [isAutoRenewOpen]);

  useEffect(() => {
    if (!saleInfo) return;

    const _options: SelectOption<[RenewalKey, RenewalRecord]>[] = Array.from(
      potentialRenewals.entries()
    )
      .filter((renewal) => renewal[0].when === saleInfo.regionBegin)
      .map((renewal) => {
        const paraId = (renewal[1].completion as any).value[0].assignment.value as number;
        const meta = chainData[network]?.[paraId];
        const name = meta?.name ?? `Parachain ${paraId}`;
        const logo = meta?.logo as string | undefined;

        const renewalMatch = Array.from(potentialRenewals.entries()).find(
          ([key, record]) =>
            (record.completion as any)?.value?.[0]?.assignment?.value === paraId &&
            saleInfo?.regionBegin === key.when
        );
        const renewalStatus = renewalMatch ? 'Needs Renewal' : 'Renewed';
        const badgeColor = renewalMatch ? '#dc2626' : '#0cc184';

        return {
          key: `${renewal[0].when}-${renewal[0].core}`,
          label: `Core ${renewal[0].core} | ${name}`,
          value: renewal,
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

    setOptions(_options);
    if (_options[0]) setSelected(_options[0].value);
  }, [saleInfo, potentialRenewals, network]);

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
      const date = typeof deadline === 'bigint' ? new Date(Number(deadline)) : (deadline as Date);
      setSelectedDeadline(formatDate(date));
    })();
  }, [selected, network, connections]);

  const interludeEndDate = useMemo(() => {
    if (!phaseEndpoints?.interlude?.end) return null;
    return new Date(phaseEndpoints.interlude.end);
  }, [phaseEndpoints]);

  const interludeEnded = useMemo(() => {
    if (!phaseEndpoints?.interlude?.end) return false;
    return Date.now() >= phaseEndpoints.interlude.end;
  }, [phaseEndpoints]);

  const allCoresSold = (saleInfo?.coresSold ?? 0) >= (saleInfo?.coresOffered ?? 0);

  const bannerMsg = useMemo(() => {
    if (allCoresSold) return 'All cores are sold — renewals are unavailable this cycle.';
    if (interludeEnded)
      return 'Sale has started — you will not be able to renew if all cores are sold';
    return null;
  }, [allCoresSold, interludeEnded]);

  const openModal = () => {
    if (!selectedAccount) return toast.error('Account not selected');
    if (allCoresSold)
      return toast.error('All cores are sold — renewals are unavailable this cycle.');
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    await renew();
    setIsModalOpen(false);
  };

  const renew = async () => {
    if (!selected) return toast.error('Core not selected');
    if (!selectedAccount) return toast.error('Account not selected');
    if (allCoresSold)
      return toast.error('All cores are sold — renewals are unavailable this cycle.');

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
          if (!ev.ok) {
            toast.error('Transaction failed', { id: toastId });
          } else {
            toast.success('Transaction succeeded!', { id: toastId });
            getAccountData({ account: selectedAccount.address, connections, network });
          }
        }
      },
      () => {
        toast.error('Transaction cancelled', { id: toastId });
      }
    );
  };

  const disableRenew = !selectedAccount || !selected || allCoresSold;
  const paraId = selected?.[1] ? (selected[1].completion as any).value[0].assignment.value : null;
  const autoRenewEnabled = useMemo(
    () => (typeof paraId === 'number' ? autoRenewSet.has(Number(paraId)) : false),
    [autoRenewSet, paraId]
  );

  return (
    <div
      className={`${styles.renewableCoresCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <div className={styles.content}>
        <p className={styles.title}>Urgent Renewals</p>

        <div className={styles.selectBox}>
          {options.length > 0 ? (
            <Select
              options={options}
              selectedValue={selected}
              onChange={setSelected}
              variant='secondary'
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

        {paraId !== null && (
          <button
            className={
              autoRenewEnabled
                ? `${styles.autoRenewButton} ${styles.autoRenewButtonEnabled}`
                : styles.autoRenewButton
            }
            onClick={() => setIsAutoRenewOpen(true)}
            disabled={!selectedAccount}
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

      {typeof paraId === 'number' && (
        <AutoRenewalModal
          isOpen={isAutoRenewOpen}
          onClose={() => setIsAutoRenewOpen(false)}
          paraId={paraId}
          coreId={selected?.[0]?.core}
        />
      )}
      <Toaster />
    </div>
  );
}
