import { JSX, useEffect, useMemo, useState } from 'react';
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

export default function AuctionPhaseStatus() {
  const network = useUnit($network);
  const saleInfo = useUnit($latestSaleInfo);
  const connections = useUnit($connections);
  const phaseEndpoints = useUnit($phaseEndpoints);

  const [currentPhase, setCurrentPhase] = useState<SalePhase | null>(null);
  const [nextPhaseStart, setNextPhaseStart] = useState<number>(0);

  const [renderedSegments, setRenderedSegments] = useState<JSX.Element[]>();
  const [renderedDots, setRenderedDots] = useState<JSX.Element[]>();

  const TOTAL_ARC_ANGLE = 200;
  const GAP_ANGLE = 10;
  const SEGMENT_COUNT = 3;
  const ARC_TOTAL_WITH_GAPS = TOTAL_ARC_ANGLE + GAP_ANGLE * (SEGMENT_COUNT - 1);

  const progressPercent = useMemo(() => {
    if (!phaseEndpoints) return 0;
    return (
      (Date.now() - phaseEndpoints.interlude.start) /
      (phaseEndpoints.fixed.end - phaseEndpoints.interlude.start)
    );
  }, [phaseEndpoints]);

  useEffect(() => {
    if (!phaseEndpoints) return;

    const totalDuration = phaseEndpoints.fixed.end - phaseEndpoints.interlude.start;
    const segments = [
      {
        label: 'Interlude Phase',
        value: (phaseEndpoints.interlude.end - phaseEndpoints.interlude.start) / totalDuration,
      },
      {
        label: 'Leadin Phase',
        value: (phaseEndpoints.leadin.end - phaseEndpoints.leadin.start) / totalDuration,
      },
      {
        label: 'Fixed Price Phase',
        value: (phaseEndpoints.fixed.end - phaseEndpoints.fixed.start) / totalDuration,
      },
    ];

    const RADIUS = 90;
    const CENTER = 100;
    const STROKE_WIDTH = 10;
    const totalValue = segments.reduce((sum, s) => sum + s.value, 0);

    let currentAngle = (10 - TOTAL_ARC_ANGLE) / 2;
    const backgroundArcs = segments.map((segment, i) => {
      const angleSpan = (segment.value / totalValue) * TOTAL_ARC_ANGLE - GAP_ANGLE;
      const x1 = CENTER + RADIUS * Math.cos((Math.PI / 180) * currentAngle);
      const y1 = CENTER + RADIUS * Math.sin((Math.PI / 180) * currentAngle);
      const x2 = CENTER + RADIUS * Math.cos((Math.PI / 180) * (currentAngle + angleSpan));
      const y2 = CENTER + RADIUS * Math.sin((Math.PI / 180) * (currentAngle + angleSpan));
      const largeArc = angleSpan > 180 ? 1 : 0;

      const path = `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`;
      currentAngle += angleSpan + GAP_ANGLE;

      return (
        <path
          key={`bg-${i}`}
          d={path}
          stroke='#888'
          strokeWidth={STROKE_WIDTH}
          fill='none'
          strokeLinecap='round'
        />
      );
    });

    const progressAngle = Math.max(0, (progressPercent - 0.1) * ARC_TOTAL_WITH_GAPS);
    let greenAngle = (10 - TOTAL_ARC_ANGLE) / 2;
    let remaining = progressAngle;
    const progressArcs: JSX.Element[] = [];

    for (let i = 0; i < segments.length && remaining > 0; i++) {
      const segmentSpan = (segments[i].value / totalValue) * TOTAL_ARC_ANGLE - GAP_ANGLE;
      const drawAngle = Math.min(remaining, segmentSpan);

      const x1 = CENTER + RADIUS * Math.cos((Math.PI / 180) * greenAngle);
      const y1 = CENTER + RADIUS * Math.sin((Math.PI / 180) * greenAngle);
      const x2 = CENTER + RADIUS * Math.cos((Math.PI / 180) * (greenAngle + drawAngle));
      const y2 = CENTER + RADIUS * Math.sin((Math.PI / 180) * (greenAngle + drawAngle));
      const largeArc = drawAngle > 180 ? 1 : 0;

      const path = `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`;
      progressArcs.push(
        <path
          key={`progress-${i}`}
          d={path}
          stroke='#00E676'
          strokeWidth={STROKE_WIDTH}
          fill='none'
          strokeLinecap='round'
        />
      );

      greenAngle += segmentSpan + GAP_ANGLE;
      remaining -= drawAngle + GAP_ANGLE;
    }

    setRenderedSegments([...backgroundArcs, ...progressArcs]);

    const DOT_COUNT = 20;
    const dotRadius = 1;
    const innerRadius = RADIUS - 14;
    const dots = [];

    const startAngle = (0 - TOTAL_ARC_ANGLE) / 2;
    const angleIncrement = TOTAL_ARC_ANGLE / (DOT_COUNT - 1);

    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = startAngle + i * angleIncrement;
      const rad = (Math.PI / 190) * angle;
      const x = CENTER + innerRadius * Math.cos(rad);
      const y = CENTER + innerRadius * Math.sin(rad);
      dots.push(<circle key={`dot-${i}`} cx={x} cy={y} r={dotRadius} fill='#6b7280' />);
    }

    setRenderedDots(dots);
  }, [phaseEndpoints, progressPercent]);

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

      const currentBlockNumber = await client
        .getTypedApi(metadata.coretimeChain)
        .query.System.Number.getValue();
      const phase = getCurrentPhase(saleInfo, currentBlockNumber);
      setCurrentPhase(phase);
    })();
  }, [network, saleInfo]);

  useEffect(() => {
    if (!phaseEndpoints) return;
    (async () => {
      if (currentPhase === SalePhase.Interlude) {
        setNextPhaseStart(phaseEndpoints.interlude.end);
      } else if (currentPhase === SalePhase.Leadin) {
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
          <div className={styles.value}>{currentPhase ?? '-'}</div>
          <div className={styles.label}>Next Phase</div>
          <div className={styles.value}>
            {currentPhase
              ? salePhases[(salePhases.indexOf(currentPhase) + 1) % salePhases.length]
              : '-'}
          </div>
          <div className={styles.label}>Next Phase Start</div>
          <div className={styles.value}>
            {nextPhaseStart
              ? new Date(nextPhaseStart).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : '-'}
          </div>
        </div>
        <div className={styles.progressWrapper}>
          <svg width='200' height='200' viewBox='0 0 200 200'>
            {renderedDots}
            {renderedSegments}
            <text x='90' y='90' textAnchor='left' className={styles.progressLabel}>
              Progress
            </text>
            <text x='90' y='110' textAnchor='left' className={styles.progressValue}>
              {Math.floor(progressPercent * 100)}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
