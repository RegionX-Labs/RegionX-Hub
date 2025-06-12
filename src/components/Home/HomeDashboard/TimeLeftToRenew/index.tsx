import { useEffect, useState } from 'react';
import styles from './TimeLeftToRenew.module.scss';
import { useUnit } from 'effector-react';
import { $phaseEndpoints, $latestSaleInfo, fetchCoresSold } from '@/coretime/saleInfo';
import { $connections, $network } from '@/api/connection';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

export default function TimeLeftToRenew() {
  const [phaseEndpoints, saleInfo, connections, network] = useUnit([
    $phaseEndpoints,
    $latestSaleInfo,
    $connections,
    $network,
  ]);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [coresRemaining, setCoresRemaining] = useState<number | null>(null);

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

  const interludeEnded = timeLeft === 0;

  return (
    <div className={styles.card}>
      <div className={styles.title}>Time Left to Renew</div>
      <div className={styles.timer}>
        {timeLeft === null
          ? '—'
          : interludeEnded
            ? 'Interlude phase has ended'
            : formatTime(timeLeft)}
      </div>
      <div className={styles.caption}>
        {interludeEnded
          ? 'Renewal is no longer guaranteed — others may purchase your core now.'
          : 'Renewal is possible after this phase, but it’s not guaranteed — anyone can purchase your core after interlude ends.'}
      </div>

      {coresRemaining !== null ? (
        <div className={styles.caption} style={{ marginTop: '8px' }}>
          {coresRemaining > 0
            ? `Only ${coresRemaining} core${coresRemaining !== 1 ? 's' : ''} remaining.`
            : 'All cores have been sold — you are unable to renew if you haven’t already.'}
        </div>
      ) : (
        <div className={styles.caption} style={{ marginTop: '8px' }}>
          Core availability data not available.
        </div>
      )}
    </div>
  );
}
