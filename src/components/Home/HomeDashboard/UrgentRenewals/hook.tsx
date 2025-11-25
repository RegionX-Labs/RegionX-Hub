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
import { $latestSaleInfo, $phaseEndpoints, fetchCoresSold } from '@/coretime/saleInfo';
import { SelectOption } from '@/types/type';
import { SOLD_OUT_MESSAGE, timesliceToTimestamp } from '@/utils';
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
  const [coresSold, setCoresSold] = useState<number | null>(null);
  const [deadlines, setDeadlines] = useState<Record<string, string>>({});

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
    () => (coresSold ?? 0) >= (saleInfo?.coresOffered ?? 0),
    [coresSold, saleInfo]
  );

  const ensureCanRenew = (selection: [RenewalKey, RenewalRecord] | null = selected) => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return false;
    }
    if (!saleInfo) {
      toast.error('Sale info unavailable');
      return false;
    }
    if (!selection) {
      toast.error('Core not selected');
      return false;
    }
    const selectedAccountData = accountData[selectedAccount.address];
    if (!selectedAccountData?.coretimeChainData) {
      toast.error('Account data unavailable');
      return false;
    }
    const freeBalance = selectedAccountData.coretimeChainData.free;
    const required = BigInt(selection[1].price);
    if (freeBalance < required) {
      toast.error('Insufficient coretime balance for renewal');
      return false;
    }
    if (allCoresSold) {
      toast.error(SOLD_OUT_MESSAGE);
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
    if (allCoresSold) return SOLD_OUT_MESSAGE;
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

  // initial fetch
  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
    void refreshAutoRenewals();
    (async () => {
      const coresSold = await fetchCoresSold(network, connections);
      setCoresSold(coresSold);
    })();
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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result: Record<string, string> = {};

      for (const option of options) {
        const [key] = option.value;
        const deadline = await timesliceToTimestamp(key.when, network, connections);
        if (cancelled) return;
        if (!deadline) {
          result[`${key.when}-${key.core}`] = '-';
          continue;
        }
        const date = typeof deadline === 'bigint' ? new Date(Number(deadline)) : (deadline as Date);
        result[`${key.when}-${key.core}`] = formatDate(date);
      }

      if (!cancelled) setDeadlines(result);
    })();

    return () => {
      cancelled = true;
    };
  }, [options, network, connections]);

  const openModal = (selection: [RenewalKey, RenewalRecord] | null = selected) => {
    const nextSelection = selection ?? selected;
    if (nextSelection) setSelected(nextSelection);
    if (!ensureCanRenew(nextSelection)) return;
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    if (!selected) return toast.error('Core not selected');
    if (!ensureCanRenew() || !selectedAccount) return;
    await renew(network, connections, selectedAccount, selected[0].core);
    setIsModalOpen(false);
  };

  const handleOpenAutoRenew = (selection: [RenewalKey, RenewalRecord] | null = selected) => {
    const nextSelection = selection ?? selected;
    if (nextSelection) setSelected(nextSelection);
    const nextParaId = nextSelection ? getParaIdFromRecord(nextSelection[1]) : null;
    const autoRenewDisabled = !selectedAccount || typeof nextParaId !== 'number';
    if (autoRenewDisabled) return;
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
    deadlines,
    allCoresSold,
    hasRenewables,
    interludeEnded,
    interludeEndDate,
    bannerMsg,
    autoRenewEnabled,
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
