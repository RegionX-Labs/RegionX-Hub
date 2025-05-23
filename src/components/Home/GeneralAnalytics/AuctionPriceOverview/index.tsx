'use client';

import { JSX, useEffect, useState } from 'react';
import styles from './AuctionPriceOverview.module.scss';
import { useUnit } from 'effector-react';
import { $network, $connections } from '@/api/connection';
import { $latestSaleInfo, $phaseEndpoints } from '@/coretime/saleInfo';
import { getCorePriceAt, getTokenSymbol, toUnit } from '@/utils';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';

export default function AuctionPriceOverview() {
  const network = useUnit($network);
  const saleInfo = useUnit($latestSaleInfo);
  const phaseEndpoints = useUnit($phaseEndpoints);
  const connections = useUnit($connections);

  const [segments, setSegments] = useState<JSX.Element[]>([]);
  const [dots, setDots] = useState<JSX.Element[]>([]);
  const [progressDot, setProgressDot] = useState<JSX.Element | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [initialPrice, setInitialPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    if (!network || !saleInfo || !connections) return;

    (async () => {
      const chainIds = getNetworkChainIds(network);
      if (!chainIds) return;

      const connection = connections[chainIds.coretimeChain];
      if (!connection || connection.status !== 'connected' || !connection.client) return;
      const client = connection.client;

      const metadata = getNetworkMetadata(network);
      if (!metadata) return;

      const currentBlock = await client
        .getTypedApi(metadata.coretimeChain)
        .query.System.Number.getValue();

      const initial = BigInt(getCorePriceAt(saleInfo.saleStart, saleInfo));
      const end = BigInt(saleInfo.endPrice || '0');
      const current = BigInt(getCorePriceAt(currentBlock, saleInfo));

      const initialNum = Number(toUnit(network, initial));
      const endNum = Number(toUnit(network, end));
      const currentNum = Number(toUnit(network, current));

      setInitialPrice(initialNum);
      setEndPrice(endNum);
      setCurrentPrice(currentNum);

      const progress = (initialNum - currentNum) / (initialNum - endNum);
      setProgressPercent(Math.max(0, Math.min(1, progress)));
    })();
  }, [network, saleInfo, connections]);

  useEffect(() => {
    if (!phaseEndpoints) return;

    const TOTAL_ARC_ANGLE = 210;
    const GAP_ANGLE = 8;
    const RADIUS = 90;
    const CENTER = 100;
    const STROKE_WIDTH = 10;

    const interludeDuration =
      (phaseEndpoints.interlude.end || 0) - (phaseEndpoints.interlude.start || 0);
    const leadinDuration = (phaseEndpoints.leadin.end || 0) - (phaseEndpoints.leadin.start || 0);
    const fixedDuration = (phaseEndpoints.fixed.end || 0) - (phaseEndpoints.fixed.start || 0);

    const totalDuration = interludeDuration + leadinDuration + fixedDuration || 1;

    const ranges = [
      { value: interludeDuration / totalDuration, color: '#EF4444' },
      { value: leadinDuration / totalDuration, color: '#FACC15' },
      { value: fixedDuration / totalDuration, color: '#22C55E' },
    ];

    const total = ranges.reduce((sum, r) => sum + r.value, 0);
    let currentAngle = (10 - TOTAL_ARC_ANGLE) / 2;

    const arcs = ranges.map((range, i) => {
      const span = (range.value / total) * TOTAL_ARC_ANGLE - GAP_ANGLE;
      const x1 = CENTER + RADIUS * Math.cos((Math.PI / 180) * currentAngle);
      const y1 = CENTER + RADIUS * Math.sin((Math.PI / 180) * currentAngle);
      const x2 = CENTER + RADIUS * Math.cos((Math.PI / 180) * (currentAngle + span));
      const y2 = CENTER + RADIUS * Math.sin((Math.PI / 180) * (currentAngle + span));
      const largeArc = span > 180 ? 1 : 0;
      const path = `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`;
      currentAngle += span + GAP_ANGLE;

      return (
        <path
          key={`seg-${i}`}
          d={path}
          stroke={range.color}
          strokeWidth={STROKE_WIDTH}
          fill='none'
          strokeLinecap='round'
        />
      );
    });

    const dotRadius = 1;
    const innerRadius = RADIUS - 12;
    const DOT_COUNT = 20;
    const dotsTemp = [];

    const startAngle = (0 - TOTAL_ARC_ANGLE) / 2;
    const angleStep = TOTAL_ARC_ANGLE / (DOT_COUNT - 1);

    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = startAngle + i * angleStep;
      const rad = (Math.PI / 180) * angle;
      const x = CENTER + innerRadius * Math.cos(rad);
      const y = CENTER + innerRadius * Math.sin(rad);
      dotsTemp.push(<circle key={`dot-${i}`} cx={x} cy={y} r={dotRadius} fill='#6b7280' />);
    }

    let angleSoFar = (10 - TOTAL_ARC_ANGLE) / 2;
    let targetColor = '#fff';
    let targetAngle = 0;
    let accumulated = 0;

    const targetProgress = progressPercent;

    for (const range of ranges) {
      const portion = range.value;
      const span = (portion / total) * TOTAL_ARC_ANGLE - GAP_ANGLE;

      if (targetProgress <= accumulated + portion) {
        const localProgress = (targetProgress - accumulated) / portion;
        targetAngle = angleSoFar + span * localProgress;
        targetColor = range.color;
        break;
      }

      accumulated += portion;
      angleSoFar += span + GAP_ANGLE;
    }

    const progressX = CENTER + RADIUS * Math.cos((Math.PI / 180) * targetAngle);
    const progressY = CENTER + RADIUS * Math.sin((Math.PI / 180) * targetAngle);

    const progressCircle = (
      <g key='progress-dot'>
        <circle cx={progressX} cy={progressY} r={9} fill={targetColor} />
        <circle cx={progressX} cy={progressY} r={4} fill='#fff' />
      </g>
    );

    setSegments(arcs);
    setDots(dotsTemp);
    setProgressDot(progressCircle);
  }, [progressPercent, phaseEndpoints]);

  return (
    <div className={styles.card}>
      <div className={styles.title}>Auction Price Overview</div>
      <div className={styles.gaugeWrapper}>
        <svg width='280' height='230' viewBox='0 0 201 150'>
          <g transform='rotate(-91 100 100)'>
            {dots}
            {segments}
            {progressDot}
          </g>
        </svg>
        <div className={styles.priceLabels}>
          <span className={styles.left}>
            {initialPrice} {getTokenSymbol(network)}
          </span>
          <span className={styles.right}>
            {endPrice} {getTokenSymbol(network)}
          </span>
        </div>
        <div className={styles.value}>{currentPrice}</div>
      </div>
      <div className={styles.label}>Real-time auction price</div>
      <button className={styles.explainBtn}>
        The price decreases over time. The longer you wait, the higher the chance that others will
        purchase the available cores.
      </button>
    </div>
  );
}
