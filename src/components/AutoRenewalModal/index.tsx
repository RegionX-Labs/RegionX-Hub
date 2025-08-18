'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './AutoRenewalModal.module.scss';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { ParaType, paraIdToAddress, toUnitFormatted, getTokenSymbol } from '@/utils';
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
  const [step, setStep] = useState<1 | 2>(1);
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

  const canProceed = useMemo(
    () =>
      checks.fundBoth &&
      checks.fundRelay &&
      checks.fundCoretime &&
      checks.openHrmp &&
      checks.enableAutoRenew &&
      !checks.loading &&
      !checks.error,
    [checks]
  );

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
        const coretimeParaId = (chainIds as any).coretime ?? (chainIds as any).coretimeParaId;
        let openHrmp = false;
        if (typeof coretimeParaId === 'number') {
          const tryGet = async () => {
            const tryA =
              (relayApi as any).query?.Hrmp?.HrmpChannels?.getValue &&
              (await (relayApi as any).query.Hrmp.HrmpChannels.getValue({
                sender: paraId,
                receiver: coretimeParaId,
              }));
            const tryB =
              (relayApi as any).query?.Hrmp?.HrmpChannels?.getValue &&
              (await (relayApi as any).query.Hrmp.HrmpChannels.getValue({
                sender: coretimeParaId,
                receiver: paraId,
              }));
            if (tryA !== undefined && tryB !== undefined) {
              const aOpen = !!tryA && !(tryA as any).isNone;
              const bOpen = !!tryB && !(tryB as any).isNone;
              return aOpen && bOpen;
            }
            const altA =
              (relayApi as any).query?.Hrmp?.Channels?.getValue &&
              (await (relayApi as any).query.Hrmp.Channels.getValue({
                sender: paraId,
                receiver: coretimeParaId,
              }));
            const altB =
              (relayApi as any).query?.Hrmp?.Channels?.getValue &&
              (await (relayApi as any).query.Hrmp.Channels.getValue({
                sender: coretimeParaId,
                receiver: paraId,
              }));
            if (altA !== undefined && altB !== undefined) {
              const aOpen = !!altA && !(altA as any).isNone;
              const bOpen = !!altB && !(altB as any).isNone;
              return aOpen && bOpen;
            }
            return false;
          };
          openHrmp = await tryGet();
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
  const chainIds = getNetworkChainIds(network);
  const coretimeParaId =
    (chainIds as any)?.coretime ?? (chainIds as any)?.coretimeParaId ?? 'CORETIME';

  const xcmCall = `// XCM v3: Transact from parachain sovereign to Coretime (para ${coretimeParaId})
xcmPallet.send(
  dest: ParentThenParachain(${coretimeParaId}),
  message: [
    WithdrawAsset(/* fee asset */),
    BuyExecution{/* weight, fee */},
    Transact{
      originKind: SovereignAccount,
      requireWeightAtMost: <set_weight>,
      call: broker.setAutoRenew(true)
    },
    RefundSurplus,
    DepositAsset{ beneficiary: SovereignOf(${paraId}) }
  ]
);`;

  return (
    <div className={styles.modalOverlay} onClick={closeByOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Auto-Renewal</h2>
          <p className={styles.subtitle}>
            We’ll auto-check everything needed for auto-renewal approval.
          </p>
          <div className={styles.pillLarge}>ParaID: {paraId}</div>
        </div>

        {step === 1 && (
          <>
            <div className={styles.section}>
              <div className={styles.row}>
                <div className={styles.iconDot} aria-hidden />
                <div className={styles.optionText}>
                  <div className={styles.optionTitle}>
                    Fund sovereign account on <b>Relay</b>{' '}
                    <span className={styles.badge}>Auto</span>
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
                <code className={styles.mono}>{fmt(checks.relayBalance)}</code>
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
                <code className={styles.mono}>{fmt(checks.coretimeBalance)}</code>
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
                disabled={!canProceed}
                onClick={() => setStep(2)}
                aria-disabled={!canProceed}
                title={canProceed ? 'All checks passed' : 'Complete all checks to continue'}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.section}>
              <div className={styles.rowTitle}>
                <div className={styles.iconDot} aria-hidden />
                <div className={styles.optionText}>
                  <div className={styles.optionTitle}>Send this from your parachain</div>
                  <div className={styles.optionSub}>
                    XCM message to Coretime (para {String(coretimeParaId)}) to approve auto-renewal.
                  </div>
                </div>
              </div>

              <pre className={styles.codeBlock}>{xcmCall}</pre>

              <div className={styles.kv}>
                <span>Beneficiary sovereign (Relay)</span>
                <code className={styles.mono}>{paraIdToAddress(paraId, ParaType.Child)}</code>
              </div>
              <div className={styles.kv}>
                <span>Beneficiary sovereign (Coretime)</span>
                <code className={styles.mono}>{paraIdToAddress(paraId, ParaType.Sibling)}</code>
              </div>

              <div className={styles.copyRow}>
                <button
                  className={styles.copyBtn}
                  onClick={() => navigator.clipboard.writeText(xcmCall)}
                  aria-label='Copy XCM call'
                >
                  <Clipboard size={16} /> Copy call
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.ghost} onClick={() => setStep(1)}>
                Back
              </button>
              <button className={styles.primary} onClick={onClose}>
                Done
              </button>
            </div>
          </>
        )}

        <button className={styles.close} onClick={onClose} aria-label='Close modal'>
          ×
        </button>
      </div>
    </div>
  );
};

export default AutoRenewalModal;
