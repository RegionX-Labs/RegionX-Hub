'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { Clipboard } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  paraId: number;
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

const AutoRenewalModal: React.FC<Props> = ({ isOpen, onClose, paraId }) => {
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

  const canProceed = true;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setChecks((p) => ({ ...p, loading: true, error: undefined }));
        const chainIds = getNetworkChainIds(network);
        const metadata = getNetworkMetadata(network);
        if (!chainIds || !metadata) throw new Error('Unknown network');
        const relayConn = connections[chainIds.relayChain];
        const coretimeConn = connections[chainIds.coretimeChain];
        if (!relayConn?.client || relayConn.status !== 'connected') {
          throw new Error('Relay connection not ready.');
        }
        if (!coretimeConn?.client || coretimeConn.status !== 'connected') {
          throw new Error('Coretime connection not ready.');
        }
        const relayApi = relayConn.client.getTypedApi(metadata.relayChain);
        const coretimeApi = coretimeConn.client.getTypedApi(metadata.coretimeChain);
        const relayAddr = paraIdToAddress(paraId, ParaType.Child);
        const coretimeAddr = paraIdToAddress(paraId, ParaType.Sibling);
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
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, paraId, connections, network]);

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
              <label className={styles.switch} aria-label='Relay funded (auto)'>
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
              <label className={styles.switch} aria-label='Coretime funded (auto)'>
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
              <label className={styles.switch} aria-label='Both funded (auto)'>
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
                  Checks <code className={styles.mono}>hrmp.hrmpChannels</code> both directions on
                  Relay.
                </div>
              </div>
              <label className={styles.switch} aria-label='HRMP open (auto)'>
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
            <button
              className={styles.primary}
              disabled={!canProceed ? true : false}
              onClick={() => setShowBytesModal(true)}
              aria-disabled={!canProceed ? true : false}
              title='Open bytes preview'
            >
              Continue
            </button>
          </div>

          <button className={styles.close} onClick={onClose} aria-label='Close modal'>
            ×
          </button>
        </div>
      </div>

      {showBytesModal && <BytesPreviewModal onClose={() => setShowBytesModal(false)} />}
    </>
  );
};

function BytesPreviewModal({ onClose }: { onClose: () => void }) {
  const hex = `0x470003010100b50f031400040001000007fcbea0ba05130001000007fcbea0ba0500060103d033527c0434321579005e0d000001a8be0500140d01000001007935`;

  const copy = () => navigator.clipboard.writeText(hex);

  const closeByOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains(styles.modalOverlay)) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={closeByOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Extrinsic Bytes (Preview)</h2>
          <p className={styles.subtitle}>SCALE-encoded hex preview</p>
        </div>

        <pre
          className={styles.codeBlock}
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {hex}
        </pre>

        <div className={styles.actions}>
          <button className={styles.ghost} onClick={onClose}>
            Close
          </button>
          <button className={styles.primary} onClick={copy}>
            <Clipboard size={16} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
            Copy bytes
          </button>
        </div>

        <button className={styles.close} onClick={onClose} aria-label='Close modal'>
          ×
        </button>
      </div>
    </div>
  );
}

export default AutoRenewalModal;
