'use client';

import { useEffect, useState } from 'react';
import styles from './RenewalsOverview.module.scss';
import { useUnit } from 'effector-react';
import { $phaseEndpoints, $latestSaleInfo, fetchCoresSold } from '@/coretime/saleInfo';
import { $connections, $network } from '@/api/connection';
import { getMinEndPrice, toUnitFormatted } from '@/utils';
import { Info } from 'lucide-react';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

export default function RenewalsOverview() {
  const [phaseEndpoints, saleInfo, connections, network] = useUnit([
    $phaseEndpoints,
    $latestSaleInfo,
    $connections,
    $network,
  ]);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [coresRemaining, setCoresRemaining] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<string | null>(null);

  useEffect(() => {
    if (!phaseEndpoints?.interlude?.end) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = phaseEndpoints.interlude.end - now;
      setTimeLeft(Math.max(0, timeRemaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [phaseEndpoints]);

  useEffect(() => {
    (async () => {
      if (!saleInfo || !network) return;
      const sold = await fetchCoresSold(network, connections);
      const offered = saleInfo.coresOffered ?? 0;
      setCoresRemaining(offered - (sold ?? 0));
    })();
  }, [saleInfo, network, connections]);

  useEffect(() => {
    if (!network) return;
    const price = getMinEndPrice(network);
    const formatted = toUnitFormatted(network, price);
    console.debug('[RenewalsOverview] min price:', formatted);
    setMinPrice(formatted);
  }, [network]);

  const interludeEnded = timeLeft === 0;

  return (
    <div className={styles.card}>
      {coresRemaining !== null && coresRemaining > 0 && (
        <div className={styles.coreCountWrapper}>
          <div className={styles.coreLabel}>Cores Remaining</div>
          <div className={styles.coreNumber}>{coresRemaining}</div>

          <div className={styles.coreLabelWithTooltip}>
            <span className={styles.coreLabel}>Min Price</span>
            <div className={styles.tooltipWrapper}>
              <Info size={14} className={styles.infoIcon} />
              <div className={styles.tooltipText}>
                This is the lowest possible price per core for this sale.
              </div>
            </div>
          </div>

          <div className={styles.coreNumber}>{minPrice || '–'}</div>
        </div>
      )}

      {coresRemaining !== null && coresRemaining === 0 && (
        <div className={styles.metricWarning}>
          All cores have been sold — you are unable to renew.
        </div>
      )}

      <div className={styles.header}>Time Left to Renew</div>

      <div className={styles.statusBox}>
        <div className={styles.statusText}>
          {timeLeft === null
            ? '—'
            : interludeEnded
              ? 'Interlude phase has ended'
              : formatTime(timeLeft)}
        </div>
        <div className={styles.statusNote}>
          {interludeEnded
            ? 'Renewal is no longer guaranteed — others may purchase your core now.'
            : 'Renewal will no longer be guaranteed after this phase.'}
        </div>
      </div>
    </div>
  );
}
