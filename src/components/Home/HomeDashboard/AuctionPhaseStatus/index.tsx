// Keep this entire block — it's the SVG-based version
import { useEffect, useState } from 'react';
import styles from './AuctionPhaseStatus.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import {
  $latestSaleInfo,
  $phaseEndpoints,
  getCurrentPhase,
  SalePhase,
  salePhases,
} from '@/coretime/saleInfo';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

export const getRelativeTime = (timestamp: number | Date): string => {
  const timeAgo = new TimeAgo('en-US');
  return timeAgo.format(timestamp, {
    steps: [
      { formatAs: 'second' },
      { formatAs: 'minute', minTime: 60 },
      { formatAs: 'hour', minTime: 60 * 60 },
      { formatAs: 'day', minTime: 24 * 60 * 60 },
    ],
    labels: 'long',
  });
};

export default function AuctionPhaseStatus() {
  const segments = [
    { label: 'Interlude Phase', value: 50, color: '#00E676' },
    { label: 'Leadin Phase', value: 30, color: '#00E676' },
    { label: 'Fixed Price Phase', value: 20, color: '#888' },
  ];

  const TOTAL_ANGLE = 190;
  const RADIUS = 90;
  const GAP_ANGLE = 10;
  const CENTER = 100;
  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);

  let currentAngle = (10 - TOTAL_ANGLE) / 2;

  const renderedSegments = segments.map((segment, i) => {
    const angleSpan = (segment.value / totalValue) * TOTAL_ANGLE - GAP_ANGLE;
    const x1 = CENTER + RADIUS * Math.cos((Math.PI / 180) * currentAngle);
    const y1 = CENTER + RADIUS * Math.sin((Math.PI / 180) * currentAngle);
    const x2 = CENTER + RADIUS * Math.cos((Math.PI / 180) * (currentAngle + angleSpan));
    const y2 = CENTER + RADIUS * Math.sin((Math.PI / 180) * (currentAngle + angleSpan));

    const largeArc = angleSpan > 180 ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}
    `;

    currentAngle += angleSpan + GAP_ANGLE;

    return (
      <path
        key={i}
        d={path}
        stroke={segment.color}
        strokeWidth={10}
        fill='none'
        strokeLinecap='round'
      />
    );
  });

  const DOT_COUNT = 20;
  const dotRadius = 1;
  const innerRadius = RADIUS - 12;
  const dots = [];

  const startAngle = (0 - TOTAL_ANGLE) / 2;
  const angleIncrement = TOTAL_ANGLE / (DOT_COUNT - 1);

  for (let i = 0; i < DOT_COUNT; i++) {
    const angle = startAngle + i * angleIncrement;
    const rad = (Math.PI / 195) * angle;
    const x = CENTER + innerRadius * Math.cos(rad);
    const y = CENTER + innerRadius * Math.sin(rad);
    dots.push(<circle key={`dot-${i}`} cx={x} cy={y} r={dotRadius} fill='#6b7280' />);
  }

  const network = useUnit($network);
  const saleInfo = useUnit($latestSaleInfo);
  const connections = useUnit($connections);
  const phaseEndpoints = useUnit($phaseEndpoints);

  const [currentPhase, setCurrentPhase] = useState<SalePhase | null>(null);
  const [nextPhaseStart, setNextPhaseStart] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (!saleInfo) return;
      const networkChainIds = getNetworkChainIds(network);
      if (!networkChainIds) return;
      const connection = connections[networkChainIds.coretimeChain];
      if (!connection || !connection.client || connection.status !== 'connected') return;

      const client = connection.client;
      const metadata = getNetworkMetadata(network);
      if (!metadata) return;

      const currentBlockNumber = await (
        client.getTypedApi(metadata.coretimeChain) as any
      ).query.System.Number.getValue();
      const phase = getCurrentPhase(saleInfo, currentBlockNumber);
      setCurrentPhase(phase);
    })();
  }, [network, saleInfo]);

  useEffect(() => {
    if (!phaseEndpoints) return;
    (async () => {
      if (currentPhase == SalePhase.Interlude) {
        setNextPhaseStart(phaseEndpoints.interlude.end);
      } else if (currentPhase == SalePhase.Leadin) {
        setNextPhaseStart(phaseEndpoints.leadin.end);
      } else {
        setNextPhaseStart(phaseEndpoints.fixed.end);
      }
    })();
  }, [phaseEndpoints, currentPhase]);

  return (
    <div className={styles.auctionPhaseCard}>
      <div className={styles.header}>Auction Phase Status</div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.label}>Current Phase</div>
          <div className={styles.value}>{currentPhase ? currentPhase : '-'}</div>
          <div className={styles.label}>Next Phase</div>
          <div className={styles.value}>
            {currentPhase
              ? salePhases[(salePhases.indexOf(currentPhase) + 1) % salePhases.length]
              : '-'}
          </div>
          <div className={styles.label}>Next Phase Start</div>
          <div className={styles.value}>
            {nextPhaseStart ? getRelativeTime(nextPhaseStart) : '-'}
          </div>
        </div>
        <div className={styles.progressWrapper}>
          <svg width='200' height='200' viewBox='0 0 200 200'>
            {dots}
            {renderedSegments}
            <text x='100' y='90' textAnchor='left' fill='#888' fontSize='12'>
              Progress
            </text>
            <text x='100' y='110' textAnchor='left' fill='#fff' fontSize='15' fontWeight='600'>
              {phaseEndpoints &&
                Math.floor(
                  ((Date.now() - phaseEndpoints.interlude.start) /
                    (phaseEndpoints.fixed.end - phaseEndpoints.interlude.start)) *
                    100
                )}
              %
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
