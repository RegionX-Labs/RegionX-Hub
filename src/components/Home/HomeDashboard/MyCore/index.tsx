import { $connections, $network } from '@/api/connection';
import styles from './MyCore.module.scss';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { $potentialRenewals, potentialRenewalsRequested, RenewalKey, RenewalRecord } from '@/coretime/renewals';
import { timesliceToTimestamp, toUnitFormatted } from '@/utils';

export default function MyCore() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const potentialRenewals = useUnit($potentialRenewals);

  const [selected, setSelected] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>("-");

  const options: SelectOption<[RenewalKey, RenewalRecord]>[] = Array.from(potentialRenewals.entries()).map((renewal) => ({
    key: `${renewal[0].core}-${renewal[0].when}`,
    label: `${renewal[0].core}`,
    value: renewal,
  }));

  useEffect(() => {
    potentialRenewalsRequested({network, connections})
  }, [network, connections]);

  const getDateFromTimeslice = async (timeslice: number | null) => {
    setSelectedDeadline('-')
    if(!timeslice) return;
    const timestamp = await timesliceToTimestamp(timeslice, network, connections);
    if(!timestamp) return setSelectedDeadline('-');

   setSelectedDeadline(timestamp.toString());
  }

  return (
    <div className={styles.myCoreCard}>
      <p className={styles.title}>My Coress</p>

      <div className={styles.selectBox}>
        <Select options={options} selectedValue={selected} onChange={(val) => {setSelected(val); getDateFromTimeslice(val ? val[0].when : null)}} />
      </div>

      <div className={styles.details}>
        <div className={styles.detailBlock}>
          <p className={styles.label}>Renewal Price</p>
          <p className={styles.value}>{selected ? toUnitFormatted(network, BigInt(selected[1].price)) : '-'}</p>
        </div>
        <div className={styles.detailBlock}>
          <p className={styles.label}>Renewal deadline</p>
          <p className={styles.value}>{selectedDeadline}</p>
        </div>
      </div>

      <button className={styles.renewButton}>Renew Now</button>
    </div>
  );
}
