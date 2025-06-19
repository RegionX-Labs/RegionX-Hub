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
import Identicon from '@polkadot/react-identicon';
import { blake2AsHex } from '@polkadot/util-crypto';

export default function RenewalInfoCard() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const saleInfo = useUnit($latestSaleInfo);
  const potentialRenewals = useUnit($potentialRenewals);

  const [selected, setSelected] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [deadline, setDeadline] = useState<string>('-');
  const [options, setOptions] = useState<SelectOption<[RenewalKey, RenewalRecord]>[]>([]);

  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
  }, [network, connections]);

  useEffect(() => {
    const _options: SelectOption<[RenewalKey, RenewalRecord]>[] = Array.from(
      potentialRenewals.entries()
    )
      .map(([key, record]) => {
        const paraId = (record.completion as any)?.value?.[0]?.assignment?.value;

        if (typeof paraId !== 'number' || isNaN(paraId)) return null;

        const chain = chainData[network]?.[paraId];
        const rawName = chain?.name || `Parachain ${paraId}`;
        const logo = chain?.logo;

        const displayName = rawName.includes(String(paraId)) ? rawName : `${rawName}`;

        return {
          key: `${key.when}-${key.core}`,
          label: displayName,
          value: [key, record],
          icon: logo ? (
            <img
              src={logo}
              alt='logo'
              style={{
                width: 24,
                height: 24,
                borderRadius: '100%',
                marginRight: 8,
              }}
            />
          ) : (
            <Identicon
              value={blake2AsHex(`${network}${paraId}`, 256)}
              size={24}
              theme='substrate'
              style={{ marginRight: 8 }}
            />
          ),
        };
      })
      .filter(Boolean) as SelectOption<[RenewalKey, RenewalRecord]>[];

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

  const paraId = selected ? (selected[1].completion as any)?.value?.[0]?.assignment?.value : null;
  const chain = paraId !== null ? chainData[network]?.[paraId] : null;
  const name = chain?.name || `Parachain ${paraId}`;
  const logoSrc = chain?.logo;
  const homepage = chain?.homepage || '';

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {selected ? (
          <div className={styles.infoBox}>
            {logoSrc ? (
              <img src={logoSrc} alt='logo' className={styles.largeLogo} />
            ) : (
              <Identicon
                value={blake2AsHex(`${network}${paraId}`, 256)}
                size={48}
                theme='substrate'
                className={styles.largeLogo}
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
