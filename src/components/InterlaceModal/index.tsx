import React, { useState, useMemo } from 'react';
import styles from './interlace-modal.module.scss';
import { X, Link } from 'lucide-react';

const RADIUS = 90;
const CENTER = 100;
const TOTAL_ANGLE = 240;
const GAP_ANGLE = 6;

interface InterlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (left: number, right: number) => void;
}

const InterlaceModal: React.FC<InterlaceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [leftRatio, setLeftRatio] = useState<string>('70');

  const parsedLeft = parseInt(leftRatio || '0', 10);
  const clampedLeft = Math.max(0, Math.min(100, isNaN(parsedLeft) ? 0 : parsedLeft));
  const rightRatio = 100 - clampedLeft;

  const arcData = useMemo(() => {
    const leftAngle = (clampedLeft / 100) * TOTAL_ANGLE - GAP_ANGLE;
    const rightAngle = (rightRatio / 100) * TOTAL_ANGLE - GAP_ANGLE;

    const startAngle = -TOTAL_ANGLE / 2;

    const createSegmentedArc = (
      start: number,
      angle: number,
      color: string,
      segments = 10,
      gap = 2
    ) => {
      const segmentAngle = (angle - gap * (segments - 1)) / segments;
      const segmentPaths = [];

      for (let i = 0; i < segments; i++) {
        const segStart = start + i * (segmentAngle + gap);
        const segEnd = segStart + segmentAngle;

        const startRad = (segStart * Math.PI) / 180;
        const endRad = (segEnd * Math.PI) / 180;

        const x1 = CENTER + RADIUS * Math.cos(startRad);
        const y1 = CENTER + RADIUS * Math.sin(startRad);
        const x2 = CENTER + RADIUS * Math.cos(endRad);
        const y2 = CENTER + RADIUS * Math.sin(endRad);

        const largeArc = segmentAngle > 180 ? 1 : 0;

        segmentPaths.push(
          <path
            key={`${color}-${i}`}
            d={`M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`}
            stroke={color}
            strokeWidth='10'
            fill='none'
            strokeLinecap='round'
          />
        );
      }

      return segmentPaths;
    };

    const thumbAngle = startAngle + leftAngle + GAP_ANGLE;
    const thumbX = CENTER + RADIUS * Math.cos((thumbAngle * Math.PI) / 180);
    const thumbY = CENTER + RADIUS * Math.sin((thumbAngle * Math.PI) / 180);

    const DOT_COUNT = 20;
    const dotRadius = 1;
    const innerRadius = RADIUS - 12;
    const angleIncrement = TOTAL_ANGLE / (DOT_COUNT - 1);
    const dots = [];

    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = -TOTAL_ANGLE / 2 + i * angleIncrement;
      const rad = (Math.PI / 180) * angle;
      const x = CENTER + innerRadius * Math.cos(rad);
      const y = CENTER + innerRadius * Math.sin(rad);
      dots.push(<circle key={i} cx={x} cy={y} r={dotRadius} fill='#6b7280' />);
    }

    return {
      leftSegments: createSegmentedArc(startAngle, leftAngle, '#00FF84'),
      rightSegments: createSegmentedArc(
        startAngle + leftAngle + GAP_ANGLE * 2,
        rightAngle,
        '#FFF500'
      ),
      thumbX,
      thumbY,
      dots,
    };
  }, [clampedLeft, rightRatio]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Interlace</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>
          With interlacing, a region can be split into two new overlapping regions. This means the
          beginning and end of the region remain the same, but both share the same core
          simultaneously. Through interlacing, the user defines the ratio of core sharing. For
          example, one region can occupy 60% of the computational capacity, while the other utilizes
          the remaining 40%.
        </p>

        <div className={styles.arcChart}>
          <svg viewBox='0 0 200 200' width='100%' height='250'>
            <g transform='rotate(270, 100, 100)'>
              {arcData.dots}
              {arcData.leftSegments}
              {arcData.rightSegments}
              <circle
                cx={arcData.thumbX}
                cy={arcData.thumbY}
                r='8'
                fill='#FFF500'
                stroke='#00FF84'
                strokeWidth='5'
              />
            </g>

            <text x='100' y='98' textAnchor='middle' fill='#ffffff' fontSize='12' fontWeight='600'>
              Computational
            </text>
            <text x='100' y='114' textAnchor='middle' fill='#ffffff' fontSize='12' fontWeight='600'>
              capacity
            </text>

            <text x='20' y='170' fontSize='10' fill='#ffffff' textAnchor='middle'>
              {clampedLeft}%
            </text>
            <text x='180' y='170' fontSize='10' fill='#ffffff' textAnchor='middle'>
              {rightRatio}%
            </text>
          </svg>
        </div>

        <p className={styles.inputLabel}>Select the ratio</p>

        <div className={styles.ratioGroup}>
          <div className={styles.ratioBox}>
            <input
              type='number'
              min={0}
              max={100}
              value={leftRatio}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,3}$/.test(val)) setLeftRatio(val);
              }}
              onWheel={(e) => e.currentTarget.blur()}
            />
            <span className={styles.percent}>%</span>
          </div>

          <div className={styles.linkWrapper}>
            <Link size={16} color='#000000' />
          </div>

          <div className={styles.ratioBox}>
            <span>{rightRatio}%</span>
          </div>
        </div>

        <button
          className={styles.assignBtn}
          onClick={() => {
            const validLeft = Math.max(1, Math.min(99, parseInt(leftRatio || '0', 10) || 0));
            onSubmit?.(validLeft, 100 - validLeft);
            onClose();
          }}
        >
          Interlace
        </button>
      </div>
    </div>
  );
};

export default InterlaceModal;
