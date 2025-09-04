'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styles from './AutoRenewalModal.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import {
  ParaType,
  paraIdToAddress,
  toUnitFormatted,
  getTokenSymbol,
  CORETIME_PARA_ID,
} from '@/utils';
import { Clipboard, ExternalLink, X } from 'lucide-react';
import { chainData } from '@/chaindata';
import { BaseChainInfo } from '@/chaindata/types';
import { Network } from '@/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  paraId: number;
  coreId?: number;
};

type CheckState = {
  fundRelay: boolean;
  fundCoretime: boolean;
  fundBoth: boolean;
  openHrmp: boolean;
  enableAutoRenew: boolean;
  relayBalance: string;
  coretimeBalance: string;
  loading: boolean;
  error?: string;
};

const MIN_BALANCE = BigInt(0);

const AutoRenewalModal: React.FC<Props> = ({ isOpen, onClose, paraId, coreId }) => {
  const [connections, network] = useUnit([$connections, $network]);
  const [checks, setChecks] = useState<CheckState>({
    fundRelay: false,
    fundCoretime: false,
    fundBoth: false,
    openHrmp: false,
    enableAutoRenew: false,
    relayBalance: '0',
    coretimeBalance: '0',
    loading: false,
  });
  const [showBytesModal, setShowBytesModal] = useState(false);
  const [encodedHex, setEncodedHex] = useState<string>('0x');
  const [encodeError, setEncodeError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setChecks((p) => ({ ...p, loading: true, error: undefined }));
        setEncodeError(undefined);

        const chainIds = getNetworkChainIds(network);
        const metadata = getNetworkMetadata(network);
        if (!chainIds || !metadata) throw new Error('Unknown network');

        const relayConn = connections[chainIds.relayChain];
        const coretimeConn = connections[chainIds.coretimeChain];
        if (!relayConn?.client || relayConn.status !== 'connected')
          throw new Error('Relay connection not ready.');
        if (!coretimeConn?.client || coretimeConn.status !== 'connected')
          throw new Error('Coretime connection not ready.');

        const relayApi = relayConn.client.getTypedApi(metadata.relayChain);
        const coretimeApi = coretimeConn.client.getTypedApi(metadata.coretimeChain);

        const relayAddr = paraIdToAddress(paraId, ParaType.Child);
        const coretimeAddr = paraIdToAddress(paraId, ParaType.Sibling);

        try {
          const encoded = await (coretimeApi as any).tx.Broker.enable_auto_renew({
            core: typeof coreId === 'number' ? coreId : 0,
            task: paraId,
            workload_end_hint: undefined,
          }).getEncodedData();
          const hex = encoded.asHex();
          if (!cancelled) setEncodedHex(hex || '0x');
        } catch (err: any) {
          if (!cancelled) {
            setEncodedHex('0x');
            setEncodeError('Failed to encode Broker.enable_auto_renew on Coretime.');
          }
        }

        const [relayAcc, coretimeAcc] = await Promise.all([
          (relayApi as any).query?.System?.Account?.getValue(relayAddr),
          (coretimeApi as any).query?.System?.Account?.getValue(coretimeAddr),
        ]);

        const toBI = (v: any) => {
          try {
            const raw = (v?.data?.free ?? v?.data?.frozen ?? v?.data)?.toString?.() ?? `${v}`;
            return BigInt(String(raw));
          } catch {
            return BigInt(0);
          }
        };

        const relayFree = toBI(relayAcc);
        const coretimeFree = toBI(coretimeAcc);
        const fundRelay = relayFree > MIN_BALANCE;
        const fundCoretime = coretimeFree > MIN_BALANCE;
        const fundBoth = fundRelay && fundCoretime;

        let openHrmp = false;
        try {
          const channel = await (relayApi as any).query?.Hrmp?.HrmpChannels?.getValue?.({
            sender: paraId,
            recipient: CORETIME_PARA_ID,
          });
          openHrmp = !!channel;
        } catch {
          openHrmp = false;
        }

        let enableAutoRenew = false;
        try {
          const pref =
            (coretimeApi as any).query?.Broker?.AutoRenewals?.getValue &&
            (await (coretimeApi as any).query.Broker.AutoRenewals.getValue(paraId));
          enableAutoRenew = Boolean(
            (pref as any)?.isSome ? (pref as any).unwrap?.() : (pref as any)
          );
        } catch {
          enableAutoRenew = false;
        }

        if (!cancelled) {
          setChecks({
            fundRelay,
            fundCoretime,
            fundBoth,
            openHrmp,
            enableAutoRenew,
            relayBalance: relayFree.toString(),
            coretimeBalance: coretimeFree.toString(),
            loading: false,
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          setChecks((p) => ({
            ...p,
            loading: false,
            error: e?.message ?? 'Failed to run checks.',
          }));
          setEncodedHex('0x');
          setEncodeError(e?.message ?? 'Unexpected error.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, paraId, coreId, connections, network]);

  if (!isOpen) return null;

  const closeByOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  const fmt = (raw: string) => {
    try {
      return toUnitFormatted(network, BigInt(raw));
    } catch {
      return raw;
    }
  };
  const symbol = getTokenSymbol(network);

  return (
    <>
      <div className={styles.modalOverlay} onClick={closeByOverlay}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>Auto-Renewal</h2>
            <p className={styles.subtitle}>
              We’ll auto-check everything needed for auto-renewal approval.
            </p>
            <div className={styles.pillLarge}>ParaID: {paraId}</div>
          </div>

          <div className={styles.section}>
            <div className={styles.row}>
              <div className={styles.iconDot} aria-hidden />
              <div className={styles.optionText}>
                <div className={styles.optionTitle}>
                  Fund sovereign account on <b>Relay</b> <span className={styles.badge}>Auto</span>
                </div>
                <div className={styles.optionSub}>
                  Address:{' '}
                  <code className={styles.mono}>{paraIdToAddress(paraId, ParaType.Child)}</code>
                </div>
              </div>
              <label className={styles.switch}>
                <input type='checkbox' checked={checks.fundRelay} readOnly disabled />
                <span className={styles.slider} />
              </label>
            </div>
            <div className={styles.kv}>
              <span>Current Relay balance</span>
              <code className={styles.mono}>
                {fmt(checks.relayBalance)} {symbol}
              </code>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.row}>
              <div className={styles.iconDot} aria-hidden />
              <div className={styles.optionText}>
                <div className={styles.optionTitle}>
                  Fund sovereign account on <b>Coretime</b>{' '}
                  <span className={styles.badge}>Auto</span>
                </div>
                <div className={styles.optionSub}>
                  Address:{' '}
                  <code className={styles.mono}>{paraIdToAddress(paraId, ParaType.Sibling)}</code>
                </div>
              </div>
              <label className={styles.switch}>
                <input type='checkbox' checked={checks.fundCoretime} readOnly disabled />
                <span className={styles.slider} />
              </label>
            </div>
            <div className={styles.kv}>
              <span>Current Coretime balance</span>
              <code className={styles.mono}>
                {fmt(checks.coretimeBalance)} {symbol}
              </code>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.row}>
              <div className={styles.iconDot} aria-hidden />
              <div className={styles.optionText}>
                <div className={styles.optionTitle}>
                  Both fee pots funded <span className={styles.badge}>Auto</span>
                </div>
                <div className={styles.optionSub}>Relay + Coretime sovereign accounts.</div>
              </div>
              <label className={styles.switch}>
                <input type='checkbox' checked={checks.fundBoth} readOnly disabled />
                <span className={styles.slider} />
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.row}>
              <div className={styles.iconDot} aria-hidden />
              <div className={styles.optionText}>
                <div className={styles.optionTitle}>
                  HRMP channel open <span className={styles.badge}>Auto</span>
                </div>
                <div className={styles.optionSub}>
                  Checks <code className={styles.mono}>hrmp.hrmpChannels</code> on Relay.
                </div>
              </div>
              <label className={styles.switch}>
                <input type='checkbox' checked={checks.openHrmp} readOnly disabled />
                <span className={styles.slider} />
              </label>
            </div>
          </div>

          {checks.loading && <div className={styles.note}>Running checks…</div>}
          {checks.error && <div className={styles.error}>{checks.error}</div>}

          <div className={styles.actions}>
            <button className={styles.ghost} onClick={onClose}>
              Close
            </button>
            <button className={styles.primary} onClick={() => setShowBytesModal(true)}>
              Continue
            </button>
          </div>

          <button className={styles.close} onClick={onClose} aria-label='Close modal'>
            <X size={16} />
          </button>
        </div>
      </div>

      {showBytesModal && (
        <BytesPreviewModal
          onClose={() => setShowBytesModal(false)}
          network={network}
          paraId={paraId}
          hex={encodedHex}
          encodeError={encodeError}
        />
      )}
    </>
  );
};

function pickFirstProvider(info?: BaseChainInfo): string | undefined {
  if (!info?.providers) return;
  const entries = Object.values(info.providers);
  return entries.find((u) => !!u) || undefined;
}

function encodeRpcParam(wsUrl: string): string {
  try {
    return encodeURIComponent(wsUrl);
  } catch {
    return wsUrl;
  }
}

function buildDecodeUrl(wsUrl: string): string {
  const enc = encodeRpcParam(wsUrl);
  return `https://polkadot.js.org/apps/?rpc=${enc}#/extrinsics/decode`;
}

function BytesPreviewModal({
  onClose,
  network,
  paraId,
  hex,
  encodeError,
}: {
  onClose: () => void;
  network: Network;
  paraId: number;
  hex: string;
  encodeError?: string;
}) {
  const chainMap = chainData[network] || {};
  const info = chainMap[paraId];
  const wsProvider = useMemo(() => pickFirstProvider(info), [info]);
  const decodeUrl = wsProvider ? buildDecodeUrl(wsProvider) : undefined;

  const copy = () => {
    if (!hex) return;
    navigator.clipboard.writeText(hex);
  };

  const closeByOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains(styles.modalOverlay)) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={closeByOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Enable Auto-Renew </h2>
          <p className={styles.subtitle}>
            This is the encoded <code className={styles.mono}>Broker.enable_auto_renew</code> call
            on the Coretime chain. To enable auto-renewal, your parachain should send an XCM{' '}
            <code className={styles.mono}>Transact</code> instruction to the Coretime chain, using
            this encoded call as the payload:{' '}
            <code className={styles.mono}>Transact(enable_auto_renew encoded call)</code>.
          </p>
        </div>

        {encodeError && <div className={styles.error}>{encodeError}</div>}

        <div className={styles.kv}>
          <span>Parachain</span>
          <code className={styles.mono}>{info?.name ?? `Para ${paraId}`}</code>
        </div>
        <div className={styles.kv}>
          <span>Provider</span>
          <code className={styles.mono}>{wsProvider ?? 'Unavailable'}</code>
        </div>

        <pre className={styles.codeBlock}>{hex || '0x'}</pre>

        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={decodeUrl}
            target='_blank'
            rel='noreferrer'
            aria-disabled={!decodeUrl}
            style={{ pointerEvents: decodeUrl ? 'auto' : 'none', opacity: decodeUrl ? 1 : 0.5 }}
          >
            <ExternalLink size={16} /> Open Polkadot.js Decode
          </a>
          <button className={styles.primary} onClick={copy} disabled={!hex}>
            <Clipboard size={16} /> Copy bytes
          </button>
          <button className={styles.ghost} onClick={onClose}>
            Close
          </button>
        </div>

        <button className={styles.close} onClick={onClose} aria-label='Close modal'>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default AutoRenewalModal;
