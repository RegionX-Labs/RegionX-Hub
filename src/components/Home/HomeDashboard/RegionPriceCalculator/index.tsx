'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import styles from './RegionPriceCalculator.module.scss';
import type { Connection } from '@/api/connection';
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
  coretimeChainBlockTime,
} from '@/utils';
import type { Network } from '@/types';

type OkResult = {
  kind: 'ok';
  targetBlockInternal: number;
  targetBlockCoretime: number | null;
  blocksToWait: number;
  targetPrice: bigint;
  etaMs: number | null;
};

type ChainCtx = {
  ids: NonNullable<ReturnType<typeof getNetworkChainIds>>;
  meta: NonNullable<ReturnType<typeof getNetworkMetadata>>;
  priceUsesRelay: boolean;
  chainId: string;
  chainMeta: any;
  conn: Connection;
};

const MAX_BLOCK_LOOKAHEAD = 500_000;

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
      return network != null ? fromUnit(network as Network, n) : null;
    } catch {
      return null;
    }
  }, [inputStr, network]);
  useEffect(() => {
    (async () => {
      if (!network || !saleInfo) return;
      const ctx = getChainContext(network as Network, saleInfo as any, connections);
      if (!ctx) return;

      const api = ctx.conn.client!.getTypedApi(ctx.chainMeta) as any;

      const nowBlock: number = await (api.query.System.Number.getValue() as Promise<number>);

      setCurrentBlock(nowBlock);
      setPhase(getCurrentPhase(saleInfo, nowBlock));
    })();
  }, [network, saleInfo, connections]);

  const [result, setResult] = useState<
    | { kind: 'idle' }
    | { kind: 'disabled'; reason: string }
    | { kind: 'loading' }
    | { kind: 'unreachable' }
    | OkResult
  >({ kind: 'idle' });

  useEffect(() => {
    (async () => {
      const early = getEarlyState(network, saleInfo, inputStr, targetPlanck, currentBlock, phase);
      if (early) {
        setResult(early);
        return;
      }

      const net = network as Network;
      const ctx = getChainContext(net, saleInfo as any, connections);
      if (!ctx) {
        setResult({ kind: 'idle' });
        return;
      }

      const priceAt = mkPriceAt(saleInfo, net);
      const nowPrice = priceAt(currentBlock!);

      const finishOk = async (targetBlockInternal: number) => {
        const ok = await mkOkResult({
          targetBlockInternal,
          currentBlock: currentBlock!,
          network: net,
          ctx,
          connections,
          priceAt,
        });
        setResult(ok);
      };

      if (nowPrice <= targetPlanck!) {
        await finishOk(currentBlock!);
        return;
      }

      const range = expandSearchRange(currentBlock!, targetPlanck!, priceAt);
      if (!range.reachable) {
        setResult({ kind: 'unreachable' });
        return;
      }

      const targetBlock = lowerBoundBlock(range.low, range.high, targetPlanck!, priceAt);
      await finishOk(targetBlock);
    })();
  }, [network, saleInfo, currentBlock, targetPlanck, inputStr, connections, phase]);

  const unit = network ? getTokenSymbol(network as Network) : '';
  const currentPriceStr =
    saleInfo && currentBlock != null
      ? toUnitFormatted(network as Network, BigInt(getCorePriceAt(currentBlock, saleInfo, network)))
      : '—';

  const coretimeSubscanBase = getCoretimeSubscanBase(network);

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
                  <span className={`${styles.key} ${styles.nowrap}`}>Price target</span>
                  <span className={`${styles.val} ${styles.nowrap}`}>
                    {toUnitFormatted(network as Network, result.targetPrice)}
                  </span>
                </div>

                <div className={styles.kv}>
                  <span className={`${styles.key} ${styles.nowrap}`}>Target block</span>
                  <span className={`${styles.val} ${styles.nowrap}`}>
                    {coretimeSubscanBase && result.targetBlockCoretime != null ? (
                      <a
                        href={`${coretimeSubscanBase}/block/${result.targetBlockCoretime}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Open in Coretime Subscan'
                        className={styles.link}
                      >
                        {result.targetBlockCoretime}
                      </a>
                    ) : (
                      '—'
                    )}
                  </span>
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

/* ---------- helpers ---------- */

function phaseLabel(p: SalePhase) {
  if (p === SalePhase.Interlude) return 'Interlude';
  if (p === SalePhase.Leadin) return 'Lead-in';
  if (p === SalePhase.FixedPrice) return 'Fixed price';
  return String(p);
}

function getCoretimeSubscanBase(network?: string | null): string {
  switch (network) {
    case 'polkadot':
      return 'https://coretime-polkadot.subscan.io';
    case 'kusama':
      return 'https://coretime-kusama.subscan.io';
    case 'paseo':
      return 'https://coretime-paseo.subscan.io';
    case 'westend':
      return 'https://coretime-westend.subscan.io';
    default:
      return '';
  }
}

function getEarlyState(
  network: string | null | undefined,
  saleInfo: any,
  inputStr: string,
  targetPlanck: bigint | null,
  currentBlock: number | null,
  phase: SalePhase | null
): { kind: 'idle' } | { kind: 'disabled'; reason: string } | { kind: 'loading' } | null {
  if (!network || !saleInfo) return { kind: 'idle' };
  if (!inputStr || !targetPlanck) return { kind: 'idle' };
  if (currentBlock == null) return { kind: 'loading' };
  if (phase === SalePhase.Interlude)
    return { kind: 'disabled', reason: 'Purchases are disabled during interlude.' };
  return null;
}

function getChainContext(
  network: Network,
  saleInfo: any,
  connections: Record<string, Connection>
): ChainCtx | null {
  const ids = getNetworkChainIds(network);
  const meta = getNetworkMetadata(network);
  if (!ids || !meta) return null;

  const priceUsesRelay = usesRelayChainBlocks(network, saleInfo);
  const chainId = priceUsesRelay ? ids.relayChain : ids.coretimeChain;
  const chainMeta = priceUsesRelay ? meta.relayChain : meta.coretimeChain;
  const conn = connections[chainId];

  if (!conn?.client || conn.status !== 'connected') return null;

  return { ids, meta, priceUsesRelay, chainId, chainMeta, conn };
}

function mkPriceAt(saleInfo: any, network: Network) {
  return (b: number) => BigInt(getCorePriceAt(b, saleInfo, network));
}

function expandSearchRange(
  currentBlock: number,
  targetPlanck: bigint,
  priceAt: (b: number) => bigint
): { low: number; high: number; reachable: boolean } {
  let low = currentBlock;
  let high = Math.min(currentBlock + 2048, currentBlock + MAX_BLOCK_LOOKAHEAD);
  let pHigh = priceAt(high);

  while (pHigh > targetPlanck && high - currentBlock < MAX_BLOCK_LOOKAHEAD) {
    const nextHigh = Math.min(high * 2 - low, currentBlock + MAX_BLOCK_LOOKAHEAD);
    if (nextHigh === high) break;
    low = high;
    high = nextHigh;
    pHigh = priceAt(high);
  }

  if (pHigh > targetPlanck) return { low, high, reachable: false };
  return { low, high, reachable: true };
}

function lowerBoundBlock(
  low: number,
  high: number,
  targetPlanck: bigint,
  priceAt: (b: number) => bigint
): number {
  let L = low;
  let R = high;
  while (L < R) {
    const mid = L + Math.floor((R - L) / 2);
    const p = priceAt(mid);
    if (p <= targetPlanck) R = mid;
    else L = mid + 1;
  }
  return R;
}

async function mkOkResult(args: {
  targetBlockInternal: number;
  currentBlock: number;
  network: Network;
  ctx: ChainCtx;
  connections: any;
  priceAt: (b: number) => bigint;
}): Promise<OkResult> {
  const { targetBlockInternal, currentBlock, network, ctx, connections, priceAt } = args;

  const etaBig = await blockToTimestamp(targetBlockInternal, ctx.conn, ctx.chainMeta);
  const etaMs = etaBig ? Number(etaBig) : null;

  let targetBlockCoretime: number | null = null;

  try {
    const coreConn = connections[ctx.ids.coretimeChain];
    const coreMeta = ctx.meta.coretimeChain;
    if (etaMs != null && coreConn?.client && coreConn.status === 'connected') {
      const coreApi = coreConn.client.getTypedApi(coreMeta);
      const nowCoreBlock = await coreApi.query.System.Number.getValue();
      const nowCoreMsBig = await blockToTimestamp(nowCoreBlock, coreConn, coreMeta);

      if (nowCoreMsBig != null) {
        const nowCoreMs = Number(nowCoreMsBig);
        const msPerBlock = coretimeChainBlockTime(network);
        const delta = etaMs - nowCoreMs;
        const deltaBlocks =
          delta >= 0 ? Math.round(delta / msPerBlock) : -Math.round(-delta / msPerBlock);
        targetBlockCoretime = Math.max(0, nowCoreBlock + deltaBlocks);
      }
    }
  } catch {
    targetBlockCoretime = null;
  }

  return {
    kind: 'ok',
    targetBlockInternal,
    targetBlockCoretime,
    blocksToWait: targetBlockInternal - currentBlock,
    targetPrice: priceAt(targetBlockInternal),
    etaMs,
  };
}
