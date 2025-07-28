'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $phaseEndpoints } from '@/coretime/saleInfo';

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

export default function NextPhaseTimer() {
  const phaseEndpoints = useUnit($phaseEndpoints);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (!phaseEndpoints) return;

      const now = Date.now();

      const phaseEndTimes = [
        phaseEndpoints.interlude.end,
        phaseEndpoints.leadin.end,
        phaseEndpoints.fixed.end,
      ];

      const nextPhaseTime = phaseEndTimes.find((t) => t > now);

      if (nextPhaseTime) {
        setTimeLeft(Math.max(0, nextPhaseTime - now));
      } else {
        setTimeLeft(null);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [phaseEndpoints]);

  if (timeLeft === null) return <>–</>;

  return <>Next phase in: {formatTime(timeLeft)}</>;
}
