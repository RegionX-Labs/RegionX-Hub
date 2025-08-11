'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import styles from './RenewableCores.module.scss';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
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

type Props = { view: string };

const formatDate = (d: Date) =>
  d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function RenewableCores({ view }: Props) {
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
  const [options, setOptions] = useState<SelectOption<[RenewalKey, RenewalRecord]>[]>([]);

  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
  }, [network, connections]);

  useEffect(() => {
    if (!saleInfo) return;
    const _options: SelectOption<[RenewalKey, RenewalRecord]>[] = Array.from(
      potentialRenewals.entries()
    )
      .filter((renewal) => renewal[0].when === saleInfo.regionBegin)
      .map((renewal) => ({
        key: `${renewal[0].when}-${renewal[0].core}`,
        label: `Core ${renewal[0].core} | ${
          chainData[network]?.[(renewal[1].completion as any).value[0].assignment.value]?.name ??
          'Parachain ' + (renewal[1].completion as any).value[0].assignment.value
        }`,
        value: renewal,
        icon: (
          <img
            style={{ width: 28, borderRadius: '100%', marginRight: 8 }}
            src={
              chainData[network]?.[(renewal[1].completion as any).value[0].assignment.value]?.logo
            }
          />
        ),
      }))
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

  // Banner message logic
  const bannerMsg = useMemo(() => {
    if (allCoresSold) return 'All cores are sold — renewals are unavailable this cycle.';
    if (interludeEnded)
      return 'Sale has started — you will not be able to renew if all cores are sold';
    return null;
  }, [allCoresSold, interludeEnded]);

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    if (allCoresSold) {
      toast.error('All cores are sold — renewals are unavailable this cycle.');
      return;
    }
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    await renew();
    setIsModalOpen(false);
  };

  const renew = async () => {
    if (!selected) {
      toast.error('Core not selected');
      return;
    }
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    if (allCoresSold) {
      toast.error('All cores are sold — renewals are unavailable this cycle.');
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

  return (
    <div
      className={`${styles.renewableCoresCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <div className={styles.content}>
        <p className={styles.title}>Renewable Cores</p>

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
          <p className={styles.interludeHeading}>Interlude ends</p>
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

      <button
        className={styles.renewButton}
        onClick={openModal}
        disabled={disableRenew}
        title={disableRenew && allCoresSold ? 'All cores are sold' : undefined}
      >
        Renew Now
      </button>

      {selectedAccount && accountData[selectedAccount.address] !== null && (
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
