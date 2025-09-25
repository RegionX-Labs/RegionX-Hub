import { $network } from '@/api/connection';
import { chainData } from '@/chaindata';
import { $potentialRenewals, RenewalKey, RenewalRecord } from '@/coretime/renewals';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import { $parachains, Parachain } from '@/parachains';
import { SelectOption } from '@/types/type';
import { useUnit } from 'effector-react';
import Identicon from '@polkadot/react-identicon';
import { blake2AsHex } from '@polkadot/util-crypto';
import Select from '@/components/elements/Select';
import styles from './ParachainInfoCard.module.scss';
import { useMemo } from 'react';

interface Props {
  selected: Parachain;
  setSelected: (id: Parachain) => void;
  onSelectParaId?: (id: string) => void;

  parasWithAutoRenewal: Set<number>;
  saleCycleRegionBegin: bigint | number | null;
  potentialRenewals: Map<RenewalKey, RenewalRecord>;
}

export const ParachainSelect = ({
  selected,
  setSelected,
  onSelectParaId,
  parasWithAutoRenewal,
  saleCycleRegionBegin,
  potentialRenewals,
}: Props) => {
  const parachains = useUnit($parachains);
  const network = useUnit($network);

  const itemsForNetwork = useMemo(
    () => parachains.filter((p) => p.network === network),
    [parachains, network]
  );

  const selectOptions: SelectOption<Parachain>[] = useMemo(() => {
    return itemsForNetwork.map((item) => {
      const meta = chainData[network]?.[item.id];
      const pname = meta?.name || `Parachain`;
      const logo = meta?.logo as string | undefined;

      const match = Array.from(potentialRenewals.entries()).find(
        ([key, record]) =>
          (record.completion as any)?.value?.[0]?.assignment?.value === item.id &&
          saleCycleRegionBegin === key.when
      );
      const coreForLabel =
        (match?.[0] as RenewalKey | undefined)?.core !== undefined
          ? Number((match![0] as RenewalKey).core)
          : undefined;

      const hasWorkplan = parasWithAutoRenewal.has(Number(item.id));
      const needsRenewal = !!match && !hasWorkplan;

      const badgeText = needsRenewal ? 'Needs Renewal' : 'Renewed';
      const badgeColor = needsRenewal ? '#dc2626' : '#0cc184';

      return {
        key: `${item.id}-${coreForLabel ?? 'current'}`,
        value: item,
        label:
          coreForLabel !== undefined
            ? `${pname} · ParaID ${item.id} · Core ${coreForLabel}`
            : `${pname} · ParaID ${item.id}`,
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
            {badgeText}
          </span>
        ),
      };
    });
  }, [itemsForNetwork, network, parasWithAutoRenewal, potentialRenewals, saleCycleRegionBegin]);

  return (
    <div className={styles.inputSection}>
      <label>Select Parachain</label>
      <Select
        options={selectOptions}
        selectedValue={selected}
        valueEquals={(a, b) => (a && b ? a.id === b.id : a === b)}
        searchable
        searchPlaceholder='Search by name or ParaID…'
        onChange={(value) => {
          if (!value) return;
          setSelected(value);
          onSelectParaId?.(value.id.toString());
        }}
        variant='secondary'
      />
    </div>
  );
};
