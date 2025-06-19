'use client';

import { useEffect, useState } from 'react';
import styles from './RenewalInfoCard.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { $parachains, parachainsRequested } from '@/parachains';
import { chainData } from '@/chaindata';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import Identicon from '@polkadot/react-identicon';
import { blake2AsHex } from '@polkadot/util-crypto';
import { ParaStateCard } from '@/components/ParaStateCard';
import { ParaState } from '@/components/ParaStateCard';

export default function RenewalInfoCard() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const parachains = useUnit($parachains);

  const [selected, setSelected] = useState<any | null>(null);
  const [options, setOptions] = useState<SelectOption<any>[]>([]);

  useEffect(() => {
    parachainsRequested(network);
  }, [network, connections]);

  useEffect(() => {
    const filtered = parachains.filter((p) => p.network === network);

    const opts: SelectOption<any>[] = filtered.map((item) => {
      const meta = chainData[network]?.[item.id];
      const name = meta?.name || `Parachain ${item.id}`;
      const logo = meta?.logo;

      return {
        key: item.id.toString(),
        label: name,
        value: item,
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
      };
    });

    setOptions(opts);
    if (opts[0]) setSelected(opts[0].value);
  }, [parachains, network]);

  const paraId = selected?.id;
  const chain = paraId !== undefined ? chainData[network]?.[paraId] : null;
  const name = chain?.name || `Parachain ${paraId}`;
  const logoSrc = chain?.logo;
  const homepage = chain?.homepage || '';
  const state = selected?.state;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {selected ? (
          <div className={styles.infoBox}>
            {logoSrc ? (
              <img src={logoSrc} alt='logo' className={styles.largeLogo} />
            ) : (
              <Identicon
                value={blake2AsHex(`${network}-${paraId}`, 256)}
                size={48}
                theme='substrate'
                className={styles.largeLogo}
              />
            )}
            <div className={styles.infoText}>
              <div className={styles.name}>
                {name}
                {typeof state === 'number' && <ParaStateCard state={state} />}
              </div>
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
          <p>No parachain selected.</p>
        )}
      </div>

      {!selected && (
        <p className={styles.description}>
          Select a parachain to view its icon, name, ID, and website.
        </p>
      )}

      <div className={styles.inputSection}>
        <label>Select Parachain</label>
        <Select options={options} selectedValue={selected} onChange={setSelected} />
      </div>
    </div>
  );
}
