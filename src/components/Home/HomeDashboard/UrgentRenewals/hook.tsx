import { $accountData } from '@/account';
import { $connections, $network } from '@/api/connection';
import { chainData } from '@/chaindata';
import {
  $potentialRenewals,
  fetchAutoRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
} from '@/coretime/renewals';
import { $latestSaleInfo, $phaseEndpoints } from '@/coretime/saleInfo';
import { SelectOption } from '@/types/type';
import { timesliceToTimestamp } from '@/utils';
import { renew } from '@/utils/transactions/renew';
import { $selectedAccount } from '@/wallet';
import { formatDate } from '@polkadot/util';
import { useUnit } from 'effector-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export function useUrgentRenewals() {
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

  const soldOutMessage =
    'Sold out—no further purchases or renewals this sale cycle. Check the secondary market for potential purchases.';

  const refreshAutoRenewals = useCallback(async () => {
    try {
      const list = await fetchAutoRenewals(network, connections);
      const set = new Set<number>(list.map((e: any) => Number(e.task)));
      setAutoRenewSet(set);
    } catch {
      // ignore – worst case, no auto-renew info
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

  const allCoresSold = useMemo(
    () => (saleInfo?.coresSold ?? 0) >= (saleInfo?.coresOffered ?? 0),
    [saleInfo]
  );

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

  const interludeEndDate = useMemo(() => {
    if (!phaseEndpoints?.interlude?.end) return null;
    return new Date(phaseEndpoints.interlude.end);
  }, [phaseEndpoints]);

  const interludeEnded = useMemo(() => {
    if (!phaseEndpoints?.interlude?.end) return false;
    return Date.now() >= phaseEndpoints.interlude.end;
  }, [phaseEndpoints]);

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
                backgroundColor: '#dc2626',
                color: 'black',
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
              }}
            >
              Needs renewal
            </span>
          ),
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [saleInfo, potentialRenewals, network]);

  const hasRenewables = options.length > 0;

  const paraId = useMemo(
    () => (selected?.[1] ? getParaIdFromRecord(selected[1]) : null),
    [selected]
  );

  const autoRenewEnabled = useMemo(
    () => (typeof paraId === 'number' ? autoRenewSet.has(paraId) : false),
    [autoRenewSet, paraId]
  );

  const disableRenew = !selectedAccount || !selected || allCoresSold;
  const disableAutoRenew = !selectedAccount || typeof paraId !== 'number';

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

      const date = typeof deadline === 'bigint' ? new Date(Number(deadline)) : (deadline as Date);

      setSelectedDeadline(formatDate(date));
    })();
  }, [selected, network, connections]);

  const openModal = () => {
    if (!ensureCanRenew()) return;
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    if (!selected) return toast.error('Core not selected');
    if (!ensureCanRenew() || !selectedAccount) return;
    await renew(network, connections, selectedAccount, selected[0].core);
    setIsModalOpen(false);
  };

  const handleOpenAutoRenew = () => {
    if (disableAutoRenew) return;
    setIsAutoRenewOpen(true);
  };

  return {
    accountData,
    network,
    selectedAccount,

    // selection + derived data
    options,
    selected,
    setSelected,
    selectedDeadline,
    allCoresSold,
    hasRenewables,
    interludeEnded,
    interludeEndDate,
    bannerMsg,
    autoRenewEnabled,
    disableRenew,
    disableAutoRenew,
    paraId,

    // modal state + actions
    isModalOpen,
    isAutoRenewOpen,
    openModal,
    onModalConfirm,
    closeModal: () => setIsModalOpen(false),
    handleOpenAutoRenew,
    closeAutoRenew: () => setIsAutoRenewOpen(false),
  };
}
