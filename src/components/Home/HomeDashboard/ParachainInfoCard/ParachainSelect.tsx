import { $network } from '@/api/connection';
import { chainData } from '@/chaindata';
import { $potentialRenewals } from '@/coretime/renewals';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import { $parachains, Parachain } from '@/parachains';
import { SelectOption } from '@/types/type';
import { useUnit } from 'effector-react';
import Identicon from '@polkadot/react-identicon';
import { blake2AsHex } from '@polkadot/util-crypto';
import Select from '@/components/elements/Select';
import styles from './ParachainInfoCard.module.scss';

interface Props {
  selected: Parachain;
  setSelected: (id: Parachain) => void;
  onSelectParaId?: (id: string) => void;
}

export const ParachainSelect = ({ selected, setSelected, onSelectParaId }: Props) => {
  const parachains = useUnit($parachains);
  const network = useUnit($network);
  const potentialRenewals = useUnit($potentialRenewals);
  const saleInfo = useUnit($latestSaleInfo);

  const selectOptions: SelectOption<Parachain>[] = parachains
    .filter((p) => p.network === network)
    .map((item) => {
      const meta = chainData[network]?.[item.id];
      const pname = meta?.name || `Parachain ${item.id}`;
      const logo = meta?.logo as string | undefined;

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
        label: `${pname} ${item.id}`,
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
    <div className={styles.inputSection}>
      <label>Select Parachain</label>
      <Select
        options={selectOptions}
        selectedValue={selected}
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
