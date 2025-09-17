'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './register-para-modal.module.scss';
import { X, UploadCloud, ShieldCheck, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $network, $connections } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (args: { paraId: number; genesisHead: Uint8Array; wasmCode: Uint8Array }) => void;
  defaultParaId?: number | null;
};

const RegisterParaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  defaultParaId = null,
}) => {
  const [network, connections, selectedAccount] = useUnit([
    $network,
    $connections,
    $selectedAccount,
  ]);

  const [paraId, setParaId] = useState<string>(defaultParaId ? String(defaultParaId) : '');
  const [genesisHead, setGenesisHead] = useState<Uint8Array | null>(null);
  const [wasmCode, setWasmCode] = useState<Uint8Array | null>(null);

  const [checkingRole, setCheckingRole] = useState(false);
  const [isParaManager, setIsParaManager] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const fileGenesisRef = useRef<HTMLInputElement | null>(null);
  const fileWasmRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsParaManager(null);
    setGenesisHead(null);
    setWasmCode(null);
    if (defaultParaId != null) setParaId(String(defaultParaId));
    void checkParaManager();
  }, [isOpen]);

  const canConfirm = useMemo(() => {
    const idOk = /^\d+$/.test(paraId) && Number(paraId) >= 0;
    return !!(idOk && genesisHead?.length && wasmCode?.length && isParaManager);
  }, [paraId, genesisHead, wasmCode, isParaManager]);

  const pickGenesis = () => fileGenesisRef.current?.click();
  const pickWasm = () => fileWasmRef.current?.click();

  const readAsBytes = async (f: File): Promise<Uint8Array> => {
    const buf = await f.arrayBuffer();
    return new Uint8Array(buf);
  };

  const handleGenesisChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const bytes = await readAsBytes(f);
      setGenesisHead(bytes);
    } catch {
      toast.error('Failed to read genesis state file');
    }
  };

  const handleWasmChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const bytes = await readAsBytes(f);
      setWasmCode(bytes);
    } catch {
      toast.error('Failed to read wasm code file');
    }
  };

  const checkParaManager = async () => {
    if (!selectedAccount) {
      setIsParaManager(false);
      return;
    }
    setCheckingRole(true);
    try {
      const ids = getNetworkChainIds(network);
      const meta = getNetworkMetadata(network);
      if (!ids || !meta) throw new Error('Missing network metadata');
      const relayConn = connections[ids.relayChain];
      if (!relayConn?.client) throw new Error('Relay connection is unavailable');

      const api = relayConn.client.getTypedApi(meta.relayChain);
      const addr = selectedAccount.address;

      const probe = async (path: string[]): Promise<boolean> => {
        try {
          const q = path.reduce((acc: any, k) => acc?.[k], (api as any).query);
          if (!q?.get) return false;
          const v = await q.get(addr);
          if (v == null) return false;
          if (typeof v === 'boolean') return v;
          return true;
        } catch {
          return false;
        }
      };

      const ok =
        (await probe(['Broker', 'para_managers'])) ||
        (await probe(['Broker', 'paraManagers'])) ||
        (await probe(['Registrar', 'para_managers'])) ||
        (await probe(['Registrar', 'paraManagers'])) ||
        (await probe(['Paras', 'para_managers'])) ||
        (await probe(['Paras', 'paraManagers']));

      setIsParaManager(ok);
      if (!ok) toast.error('This account is not a parachain manager.');
    } catch {
      setIsParaManager(false);
      toast.error('Could not verify parachain manager role. Check the runtime path.');
    } finally {
      setCheckingRole(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAccount) return toast.error('Connect a wallet first.');
    if (!/^\d+$/.test(paraId)) return toast.error('Enter a valid Para ID.');
    if (!genesisHead?.length) return toast.error('Upload a genesis state file.');
    if (!wasmCode?.length) return toast.error('Upload a wasm code file.');
    if (!isParaManager) return toast.error('Only parachain managers can register a parachain.');
    try {
      setLoading(true);
      onConfirm({
        paraId: Number(paraId),
        genesisHead,
        wasmCode,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        role='dialog'
        aria-modal='true'
        aria-labelledby='reg-title'
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
          <div className={styles.rowTitle}>Role Check</div>
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>Parachain manager</span>
              <span className={styles.valueMono}>
                {checkingRole ? 'Checking…' : isParaManager ? 'Yes' : 'No'}
              </span>
            </div>
            {!isParaManager && !checkingRole ? (
              <div className={styles.note}>
                <AlertTriangle size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />
                Your current account doesn’t appear to have the parachain manager role.
              </div>
            ) : null}
            <div className={styles.actionsRow}>
              <button
                className={styles.ghostBtn}
                onClick={checkParaManager}
                disabled={checkingRole}
              >
                Re-check
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>Genesis State</div>
          <div className={styles.fileRow}>
            <button className={styles.fileBtn} onClick={() => fileGenesisRef.current?.click()}>
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
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.rowTitle}>Wasm Code</div>
          <div className={styles.fileRow}>
            <button className={styles.fileBtn} onClick={() => fileWasmRef.current?.click()}>
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
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.ghostBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={styles.primaryBtn}
            onClick={handleConfirm}
            disabled={loading || !canConfirm}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterParaModal;
