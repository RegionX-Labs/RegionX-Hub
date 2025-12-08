'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { Timer, Info } from 'lucide-react';
import { $phaseEndpoints } from '@/coretime/saleInfo';
import styles from './NextPhaseTimer.module.scss';

type PhaseKey = 'interlude' | 'leadin' | 'fixed';

const PHASE_LABEL: Record<PhaseKey, string> = {
  interlude: 'Interlude',
  leadin: 'Lead-in',
  fixed: 'Fixed Price',
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}D ${hours}H ${minutes}M`;
};

function getCurrentPhase(now: number, ep: any): PhaseKey | null {
  if (!ep) return null;
  if (now < ep.interlude?.end) return 'interlude';
  if (now < ep.leadin?.end) return 'leadin';
  if (now < ep.fixed?.end) return 'fixed';
  return null;
}

function getNextPhase(current: PhaseKey | null): PhaseKey | null {
  if (current === 'interlude') return 'leadin';
  if (current === 'leadin') return 'fixed';
  if (current === 'fixed') return 'interlude';
  return 'interlude';
}

export default function NextPhaseTimer() {
  const ep = useUnit($phaseEndpoints);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const nextPhase = useMemo(() => {
    const now = Date.now();
    const current = getCurrentPhase(now, ep);
    return getNextPhase(current);
  }, [ep]);

  useEffect(() => {
    if (!ep) return setTimeLeft(null);
    const tick = () => {
      const now = Date.now();
      const ends = [ep.interlude?.end, ep.leadin?.end, ep.fixed?.end].filter(Boolean) as number[];
      const nextEnd = ends.find((t) => t > now);
      setTimeLeft(nextEnd ? Math.max(0, nextEnd - now) : null);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ep]);

  if (timeLeft === null) return <div className={styles.timerChip}>—</div>;

  return (
    <div className={styles.timerChip} aria-label='Time left to next phase'>
      <Timer className={styles.icon} size={18} />
      <span className={styles.timeText}>{formatTime(timeLeft)}</span>

      <div className={styles.infoWrap} tabIndex={0}>
        <Info size={16} aria-hidden />
        <div className={styles.tooltip} role='tooltip'>
          Time left until this phase ends. (Next phase: {nextPhase ? PHASE_LABEL[nextPhase] : '—'})
        </div>
      </div>
    </div>
  );
}
