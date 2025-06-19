'use client';

import { useEffect, useState } from 'react';
import styles from './RenewalInfoCard.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
} from '@/coretime/renewals';
import { timesliceToTimestamp } from '@/utils';
import { chainData } from '@/chaindata';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';

export default function RenewalInfoCard() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const saleInfo = useUnit($latestSaleInfo);
  const potentialRenewals = useUnit($potentialRenewals);

  const [selected, setSelected] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [deadline, setDeadline] = useState<string>('-');
  const [options, setOptions] = useState<SelectOption<[RenewalKey, RenewalRecord]>[]>([]);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
  }, [network, connections]);

  useEffect(() => {
    const _options: SelectOption<[RenewalKey, RenewalRecord]>[] = Array.from(
      potentialRenewals.entries()
    ).map(([key, record]) => {
      const paraId = (record.completion as any).value[0].assignment.value;
      const rawName = chainData[network]?.[paraId]?.name || `Parachain ${paraId}`;
      const logo = chainData[network]?.[paraId]?.logo;

      const displayName = rawName.includes(String(paraId)) ? rawName : `${rawName}`;

      return {
        key: `${key.when}-${key.core}`,
        label: displayName,
        value: [key, record],
        icon: logo ? (
          <img
            src={logo}
            style={{
              width: 24,
              borderRadius: '100%',
              marginRight: 8,
            }}
          />
        ) : undefined,
      };
    });

    setOptions(_options);
    if (_options[0]) setSelected(_options[0].value);
  }, [saleInfo, potentialRenewals, network]);

  useEffect(() => {
    (async () => {
      if (!selected) return setDeadline('-');
      const ts = await timesliceToTimestamp(selected[0].when, network, connections);
      setDeadline(ts ? new Date(Number(ts)).toLocaleString() : '-');
    })();
  }, [selected]);

  const paraId = selected ? (selected[1].completion as any).value[0].assignment.value : null;
  const rawName =
    paraId !== null ? chainData[network]?.[paraId]?.name || `Parachain ${paraId}` : '';
  const name = rawName;
  const logoSrc = paraId !== null ? chainData[network]?.[paraId]?.logo : '';
  const homepage = paraId !== null ? chainData[network]?.[paraId]?.homepage : '';

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {selected ? (
          <div className={styles.infoBox}>
            {showLogo && logoSrc && (
              <img
                src={logoSrc}
                alt='logo'
                className={styles.largeLogo}
                onError={() => setShowLogo(false)}
              />
            )}
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
          <p>No renewal info found.</p>
        )}
      </div>

      {!selected && (
        <p className={styles.description}>
          Select a parachain to view its icon, name, ID, and website. Use this to confirm renewal
          deadlines and verify parachain details.
        </p>
      )}
      <div className={styles.inputSection}>
        <label>Select Parachain</label>
        <Select options={options} selectedValue={selected} onChange={setSelected} />
      </div>
    </div>
  );
}
