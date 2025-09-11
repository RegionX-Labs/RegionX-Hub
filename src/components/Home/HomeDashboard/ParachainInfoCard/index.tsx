'use client';

import { useEffect, useState } from 'react';
import styles from './ParachainInfoCard.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { $parachains, Parachain, parachainsRequested } from '@/parachains';
import { chainData } from '@/chaindata';
import Identicon from '@polkadot/react-identicon';
import { blake2AsHex } from '@polkadot/util-crypto';
import { ParaStateCard, ParaState, paraStateProperties } from '@/components/ParaStateCard';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
  fetchAutoRenewals,
} from '@/coretime/renewals';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import { timesliceToTimestamp, toUnitFormatted } from '@/utils';
import { ParachainSelect } from './ParachainSelect';
import { ParaActions } from './ParaActions';

type Props = {
  onSelectParaId?: (id: string) => void;
  initialParaId?: string;
};

export default function ParachainInfoCard({ onSelectParaId, initialParaId }: Props) {
  const [selected, setSelected] = useState<Parachain | null>(null);
  const [renewalEntry, setRenewalEntry] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [deadline, setDeadline] = useState<string>('-');
  const [parasWithAutoRenewal, setParasWithAutoRenewal] = useState<Set<number>>(new Set());
  const [hasSetInitial, setHasSetInitial] = useState(false);

  const [network, connections, potentialRenewals, saleInfo, parachains] = useUnit([
    $network,
    $connections,
    $potentialRenewals,
    $latestSaleInfo,
    $parachains,
  ]);

  useEffect(() => {
    parachainsRequested(network);
    potentialRenewalsRequested({ network, connections });
    void refreshAutoRenewals();
  }, [network, connections]);

  useEffect(() => {
    const selectedIsForNetwork = selected?.network === network;
    const urlMatch =
      initialParaId && parachains.find((p) => `${p.id}` === initialParaId && p.network === network);

    if (!hasSetInitial || !selectedIsForNetwork) {
      if (urlMatch) {
        setSelected(urlMatch);
        onSelectParaId?.(urlMatch.id.toString());
      } else {
        const fallback = parachains.find((p) => p.network === network);
        setSelected(fallback ?? null);
        if (fallback) onSelectParaId?.(fallback.id.toString());
      }
      setHasSetInitial(true);
    }
  }, [network, parachains, initialParaId, hasSetInitial, selected?.network, onSelectParaId]);

  const refreshAutoRenewals = async () => {
    try {
      const list = await fetchAutoRenewals(network, connections);
      const set = new Set<number>(list.map((e: any) => Number(e.task)));
      setParasWithAutoRenewal(set);
    } catch {}
  };

  useEffect(() => {
    if (!saleInfo || !selected) return;
    const match = Array.from(potentialRenewals.entries()).find(
      ([key, record]) =>
        (record.completion as any)?.value?.[0]?.assignment?.value === selected.id &&
        saleInfo.regionBegin === key.when
    );
    setRenewalEntry(match ?? null);
  }, [potentialRenewals, selected, saleInfo]);

  useEffect(() => {
    (async () => {
      if (!renewalEntry) {
        setDeadline('-');
        return;
      }
      const [key] = renewalEntry;
      const ts = await timesliceToTimestamp(key.when, network, connections);
      const date = typeof ts === 'bigint' ? new Date(Number(ts)) : ts;
      if (!date || !(date instanceof Date)) {
        setDeadline('-');
        return;
      }
      setDeadline(
        date.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    })();
  }, [renewalEntry, network, connections]);

  const paraId = selected?.id as number | undefined;
  const state = selected?.state ?? undefined;
  const chain = paraId !== undefined ? chainData[network]?.[paraId] : null;
  const name = chain?.name || (paraId !== undefined ? `Parachain ${paraId}` : 'Parachain');
  const logoSrc = chain?.logo;

  const pickSolid = (c?: string) => {
    if (!c) return undefined;
    if (c.includes('gradient')) {
      const m = c.match(/#([0-9a-fA-F]{3,8})|rgba?\([^)]+\)/);
      return m?.[0] || undefined;
    }
    return c;
  };
  const solidAccent = pickSolid((chain as any)?.color);

  const logo = logoSrc ? (
    <img src={logoSrc} alt='logo' className={styles.largeLogo} />
  ) : (
    <Identicon
      value={blake2AsHex(`${network}-${paraId}`, 256)}
      size={48}
      theme='substrate'
      className={styles.largeLogo}
    />
  );

  const dateTitle = renewalEntry ? 'Renewal deadline' : 'End of sale cycle';

  return (
    <div
      className={styles.card}
      style={solidAccent ? { borderColor: solidAccent, borderWidth: '1px' } : undefined}
    >
      <div className={styles.content}>
        {selected ? (
          <div className={styles.infoBox}>
            {logo}
            <div className={styles.infoText}>
              <div className={styles.name}>{name}</div>
              <div className={styles.paraId}>Para ID: {paraId}</div>
              {chain?.homepage && (
                <a
                  href={chain.homepage}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.siteLink}
                >
                  {chain.homepage}
                </a>
              )}
            </div>
          </div>
        ) : (
          <p />
        )}

        {state && (
          <div className={styles.stateTooltip}>
            <ParaStateCard
              state={state}
              withTooltip={state === ParaState.SYSTEM}
              renewalStatus={
                state !== ParaState.SYSTEM ? (renewalEntry ? 'needed' : 'done') : undefined
              }
            />
            <div className={styles.stateText}>
              {(() => {
                if (state === ParaState.SYSTEM) {
                  return paraStateProperties[state]?.description;
                }
                const renewalStatus = renewalEntry ? 'needed' : 'done';
                if (renewalStatus === 'done') {
                  return 'This parachain has renewed the core on time and doesn’t need to do anything until the beginning of the next sale cycle.';
                }
                if (renewalStatus === 'needed') {
                  return 'This parachain needs to renew the core, otherwise it may stop if not renewed on time.';
                }
                return paraStateProperties[state]?.description;
              })()}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ParachainSelect
          onSelectParaId={onSelectParaId}
          selected={selected}
          setSelected={setSelected}
        />
      )}

      {renewalEntry && (
        <div className={styles.summaryRow}>
          <div className={styles.priceBox}>
            <span className={styles.priceLabel}>Renewal Price</span>
            <span className={styles.priceValue}>
              {toUnitFormatted(network, BigInt(renewalEntry[1].price))}
            </span>
          </div>
          <div className={styles.dateWrap}>
            <span className={styles.dateTitle}>{dateTitle}</span>
            <span className={styles.dateValue}>{deadline}</span>
          </div>
        </div>
      )}

      {selected && (
        <ParaActions
          paraState={state}
          parasWithAutoRenewal={parasWithAutoRenewal}
          paraId={selected.id}
        />
      )}
    </div>
  );
}
