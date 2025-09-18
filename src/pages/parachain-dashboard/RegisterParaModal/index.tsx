'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback, useTransition } from 'react';
import styles from './register-para-modal.module.scss';
import { X, UploadCloud, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $network, $connections } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { encodeAddress } from '@polkadot/util-crypto';

function useDebouncedValue<T>(value: T, delay = 450) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (args: { paraId: number; genesisHead: Uint8Array; wasmCode: Uint8Array }) => void;
};

const RegisterParaModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  const [network, connections, selectedAccount] = useUnit([
    $network,
    $connections,
    $selectedAccount,
  ]);

  const [paraId, setParaId] = useState<string>('');
  const debouncedParaId = useDebouncedValue(paraId, 450);

  const [genesisHead, setGenesisHead] = useState<Uint8Array | null>(null);
  const [wasmCode, setWasmCode] = useState<Uint8Array | null>(null);

  const [isParaManager, setIsParaManager] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [showSlowSpinner, setShowSlowSpinner] = useState(false);

  const [_, startTransition] = useTransition();
  const fileGenesisRef = useRef<HTMLInputElement | null>(null);
  const fileWasmRef = useRef<HTMLInputElement | null>(null);

  const requestIdRef = useRef(0);
  const slowTimerRef = useRef<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) return;

    const idStr = debouncedParaId.trim();
    if (!idStr || !/^\d+$/.test(idStr)) {
      if (slowTimerRef.current) window.clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
      setShowSlowSpinner(false);
      setIsParaManager(false);
      setIsLocked(false);
      return;
    }

    const currentReq = ++requestIdRef.current;

    if (slowTimerRef.current) window.clearTimeout(slowTimerRef.current);
    setShowSlowSpinner(false);
    slowTimerRef.current = window.setTimeout(() => setShowSlowSpinner(true), 600);

    (async () => {
      try {
        const ids = getNetworkChainIds(network);
        const meta = getNetworkMetadata(network);
        if (!ids || !meta) throw new Error('Missing network metadata');
        const relayConn = connections[ids.relayChain];
        if (!relayConn?.client) throw new Error('Relay connection is unavailable');

        const api = relayConn.client.getTypedApi(meta.relayChain);
        const registrar = await api.query.Registrar.Paras.getValue(Number(idStr));

        if (currentReq !== requestIdRef.current) return;

        if (!registrar) {
          startTransition(() => {
            setIsLocked(false);
            setIsParaManager(false);
          });
          return;
        }

        const lockedNext = !!registrar.locked;
        const isMgrNext =
          !!selectedAccount &&
          encodeAddress(registrar.manager, 42) === encodeAddress(selectedAccount.address, 24);

        startTransition(() => {
          setIsLocked((p) => (p !== lockedNext ? lockedNext : p));
          setIsParaManager((p) => (p !== isMgrNext ? isMgrNext : p));
        });
      } catch {
        if (currentReq !== requestIdRef.current) return;
      } finally {
        if (currentReq === requestIdRef.current) {
          if (slowTimerRef.current) window.clearTimeout(slowTimerRef.current);
          slowTimerRef.current = null;
          setShowSlowSpinner(false);
        }
      }
    })();
  }, [debouncedParaId, isOpen, network, connections, selectedAccount, startTransition]);

  const canConfirm = useMemo(() => {
    const idOk = /^\d+$/.test(paraId) && Number(paraId) >= 0;
    return !!(idOk && genesisHead?.length && wasmCode?.length && isParaManager && !isLocked);
  }, [paraId, genesisHead, wasmCode, isParaManager, isLocked]);

  const pickGenesis = () => fileGenesisRef.current?.click();
  const pickWasm = () => fileWasmRef.current?.click();

  const readAsBytes = async (f: File): Promise<Uint8Array> => new Uint8Array(await f.arrayBuffer());

  const handleGenesisChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setGenesisHead(await readAsBytes(f));
    } catch {
      toast.error('Failed to read genesis state file');
    }
  };

  const handleWasmChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setWasmCode(await readAsBytes(f));
    } catch {
      toast.error('Failed to read wasm code file');
    }
  };

  const handleConfirm = async () => {
    if (!selectedAccount) return toast.error('Connect a wallet first.');
    if (!/^\d+$/.test(paraId)) return toast.error('Enter a valid Para ID.');
    if (!genesisHead?.length) return toast.error('Upload a genesis state file.');
    if (!wasmCode?.length) return toast.error('Upload a wasm code file.');
    if (!isParaManager) return toast.error('Only parachain managers can register a parachain.');
    if (isLocked) return toast.error('Registration is currently locked by the registrar.');
    onConfirm({ paraId: Number(paraId), genesisHead, wasmCode });
  };

  if (!isOpen) return null;

  const onOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onOverlayClick}>
      <div
        className={styles.modalContent}
        role='dialog'
        aria-modal='true'
        aria-labelledby='reg-title'
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose} aria-label='Close'>
          <X size={18} />
        </button>

        <div className={styles.header}>
          <div className={styles.titles}>
            <h2 id='reg-title'>Register Parachain</h2>
            <p className={styles.subtitle}>
              Provide a Para ID, genesis state, and validation code.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>Para ID</div>
          <div className={styles.inputRow}>
            <input
              className={styles.textInput}
              placeholder='Enter ParaID'
              value={paraId}
              onChange={(e) => setParaId(e.target.value.replace(/[^\d]/g, ''))}
              inputMode='numeric'
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>
            Role &amp; Status{' '}
            {showSlowSpinner && <span className={styles.dotSpinner} aria-hidden />}
          </div>
          <div className={styles.summaryBox} aria-busy={showSlowSpinner}>
            <div className={styles.summaryRow}>
              <span>Parachain manager</span>
              <span className={styles.valueMono}>{isParaManager ? 'Yes' : 'No'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Registration status</span>
              <span className={styles.valueMono}>{isLocked ? 'Locked' : 'Open'}</span>
            </div>

            {!isParaManager && (
              <div className={styles.note}>
                <AlertTriangle size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />
                Your current account doesn’t appear to have the parachain manager role.
              </div>
            )}

            {isLocked && (
              <div className={styles.banner} role='status' aria-live='polite'>
                <AlertTriangle size={14} style={{ marginTop: 2 }} />
                <div>
                  Registration for this Para ID is currently <b>locked by the registrar</b>.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>Genesis State</div>
          <div className={styles.fileRow}>
            <button
              className={styles.fileBtn}
              onClick={() => fileGenesisRef.current?.click()}
              disabled={isLocked}
            >
              <UploadCloud size={16} /> Choose file
            </button>
            <span className={styles.fileName}>
              {genesisHead ? `Selected (${genesisHead.length} bytes)` : 'No file selected'}
            </span>
            <input
              ref={fileGenesisRef}
              type='file'
              accept='*/*'
              onChange={handleGenesisChange}
              style={{ display: 'none' }}
              disabled={isLocked}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>Wasm Code</div>
          <div className={styles.fileRow}>
            <button
              className={styles.fileBtn}
              onClick={() => fileWasmRef.current?.click()}
              disabled={isLocked}
            >
              <UploadCloud size={16} /> Choose file
            </button>
            <span className={styles.fileName}>
              {wasmCode ? `Selected (${wasmCode.length} bytes)` : 'No file selected'}
            </span>
            <input
              ref={fileWasmRef}
              type='file'
              accept='*/*'
              onChange={handleWasmChange}
              style={{ display: 'none' }}
              disabled={isLocked}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.ghostBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.primaryBtn} onClick={handleConfirm} disabled={!canConfirm}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterParaModal;
