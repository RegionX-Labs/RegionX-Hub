'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './RegionPriceCalculator.module.scss';

import { $connections, $network } from '@/api/connection';
import { $latestSaleInfo, getCurrentPhase, SalePhase } from '@/coretime/saleInfo';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import {
  fromUnit,
  toUnitFormatted,
  getCorePriceAt,
  usesRelayChainBlocks,
  blockToTimestamp,
  getTokenSymbol,
} from '@/utils';

export default function RegionPriceCalculator() {
  const [network, connections, saleInfo] = useUnit([$network, $connections, $latestSaleInfo]);

  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [phase, setPhase] = useState<SalePhase | null>(null);

  const [inputStr, setInputStr] = useState<string>('');

  const targetPlanck: bigint | null = useMemo(() => {
    const s = inputStr.trim().replace(',', '.');
    if (!s) return null;
    if (!/^\d*\.?\d*$/.test(s)) return null;
    const n = parseFloat(s);
    if (!Number.isFinite(n) || n < 0) return null;
    try {
      return network != null ? fromUnit(network, n) : null;
    } catch {
      return null;
    }
  }, [inputStr, network]);

  useEffect(() => {
    (async () => {
      if (!network || !saleInfo) return;
      const ids = getNetworkChainIds(network);
      if (!ids) return;
      const meta = getNetworkMetadata(network);
      if (!meta) return;

      const useRelay = usesRelayChainBlocks(network, saleInfo as any);
      const chainId = useRelay ? ids.relayChain : ids.coretimeChain;
      const chainMeta = useRelay ? meta.relayChain : meta.coretimeChain;
      const conn = connections[chainId];
      if (!conn?.client || conn.status !== 'connected') return;

      const api = conn.client.getTypedApi(chainMeta);
      const nowBlock = await api.query.System.Number.getValue();
      setCurrentBlock(nowBlock);
      setPhase(getCurrentPhase(saleInfo, nowBlock));
    })();
  }, [network, saleInfo, connections]);

  const [result, setResult] = useState<
    | { kind: 'idle' }
    | { kind: 'disabled'; reason: string }
    | { kind: 'loading' }
    | { kind: 'unreachable' }
    | {
        kind: 'ok';
        targetBlock: number;
        blocksToWait: number;
        targetPrice: bigint;
        etaMs: number | null;
      }
  >({ kind: 'idle' });

  useEffect(() => {
    (async () => {
      if (!network || !saleInfo) {
        setResult({ kind: 'idle' });
        return;
      }
      if (!inputStr) {
        setResult({ kind: 'idle' });
        return;
      }
      if (!targetPlanck) {
        setResult({ kind: 'idle' });
        return;
      }
      if (currentBlock == null) {
        setResult({ kind: 'loading' });
        return;
      }
      if (phase === SalePhase.Interlude) {
        setResult({ kind: 'disabled', reason: 'Purchases are disabled during interlude.' });
        return;
      }

      const ids = getNetworkChainIds(network);
      if (!ids) {
        setResult({ kind: 'idle' });
        return;
      }
      const meta = getNetworkMetadata(network);
      if (!meta) {
        setResult({ kind: 'idle' });
        return;
      }
      const useRelay = usesRelayChainBlocks(network, saleInfo as any);
      const chainId = useRelay ? ids.relayChain : ids.coretimeChain;
      const chainMeta = useRelay ? meta.relayChain : meta.coretimeChain;
      const conn = connections[chainId];
      if (!conn?.client || conn.status !== 'connected') {
        setResult({ kind: 'idle' });
        return;
      }

      const priceAt = (b: number) => BigInt(getCorePriceAt(b, saleInfo, network));

      const nowPrice = priceAt(currentBlock);
      if (nowPrice <= targetPlanck) {
        const eta = await blockToTimestamp(currentBlock, conn, chainMeta);
        setResult({
          kind: 'ok',
          targetBlock: currentBlock,
          blocksToWait: 0,
          targetPrice: nowPrice,
          etaMs: eta ? Number(eta) : null,
        });
        return;
      }

      const MAX = 500_000;
      let low = currentBlock;
      let high = Math.min(currentBlock + 2048, currentBlock + MAX);
      let pHigh = priceAt(high);

      while (pHigh > targetPlanck && high - currentBlock < MAX) {
        const nextHigh = Math.min(high * 2 - low, currentBlock + MAX);
        if (nextHigh === high) break;
        low = high;
        high = nextHigh;
        pHigh = priceAt(high);
      }

      if (pHigh > targetPlanck) {
        setResult({ kind: 'unreachable' });
        return;
      }

      let L = low;
      let R = high;
      while (L < R) {
        const mid = L + Math.floor((R - L) / 2);
        const p = priceAt(mid);
        if (p <= targetPlanck) R = mid;
        else L = mid + 1;
      }

      const pTarget = priceAt(R);
      const eta = await blockToTimestamp(R, conn, chainMeta);
      setResult({
        kind: 'ok',
        targetBlock: R,
        blocksToWait: R - currentBlock,
        targetPrice: pTarget,
        etaMs: eta ? Number(eta) : null,
      });
    })();
  }, [network, saleInfo, currentBlock, targetPlanck, inputStr, connections, phase]);

  const unit = network ? getTokenSymbol(network) : '';
  const currentPriceStr =
    saleInfo && currentBlock != null
      ? toUnitFormatted(network, BigInt(getCorePriceAt(currentBlock, saleInfo, network)))
      : '—';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>Region Price Calculator</div>
        <div className={styles.badge}>{phase ? phaseLabel(phase) : '—'}</div>
      </div>

      <div className={styles.inputRow}>
        <label className={styles.label}>Target price</label>
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            placeholder={`Enter desired price in ${unit}`}
            inputMode='decimal'
            value={inputStr}
            onChange={(e) => {
              const val = e.target.value.replace(',', '.');
              if (/^\d*\.?\d*$/.test(val)) setInputStr(val);
            }}
          />
          <span className={styles.unit}>{unit}</span>
        </div>
        <div className={styles.hint}>
          Current price: <strong className={styles.nowrap}>{currentPriceStr}</strong>
        </div>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultContent}>
          {result.kind === 'idle' && (
            <p className={styles.muted}>Enter a target price to calculate ETA.</p>
          )}
          {result.kind === 'loading' && <p className={styles.muted}>Calculating…</p>}
          {result.kind === 'disabled' && <p className={styles.warn}>{result.reason}</p>}
          {result.kind === 'unreachable' && (
            <p className={styles.error}>This price won’t be reached in the current sale window.</p>
          )}
          {result.kind === 'ok' && (
            <>
              <div className={styles.grid}>
                <div className={styles.kv}>
                  <span className={`${styles.key} ${styles.nowrap}`}>ETA price</span>
                  <span className={`${styles.val} ${styles.nowrap}`}>
                    {toUnitFormatted(network, result.targetPrice)}
                  </span>
                </div>
                <div className={styles.kv}>
                  <span className={`${styles.key} ${styles.nowrap}`}>Target block</span>
                  <span className={`${styles.val} ${styles.nowrap}`}>{result.targetBlock}</span>
                </div>
                <div className={styles.kv}>
                  <span className={`${styles.key} ${styles.nowrap}`}>Blocks to wait</span>
                  <span className={`${styles.val} ${styles.nowrap}`}>{result.blocksToWait}</span>
                </div>
                <div className={styles.kv}>
                  <span className={`${styles.key} ${styles.nowrap}`}>Approx. time</span>
                  <span className={`${styles.val} ${styles.nowrap}`}>
                    {result.etaMs != null ? new Date(result.etaMs).toLocaleString() : '~'}
                  </span>
                </div>
              </div>
              {result.blocksToWait === 0 && (
                <p className={styles.success}>Already at or below your target.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function phaseLabel(p: SalePhase) {
  if (p === SalePhase.Interlude) return 'Interlude';
  if (p === SalePhase.Leadin) return 'Lead-in';
  if (p === SalePhase.FixedPrice) return 'Fixed price';
  return String(p);
}
