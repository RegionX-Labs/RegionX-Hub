import React, { useState, useEffect } from 'react';
import Select from '../../components/elements/Select';
import Button from '../../components/elements/Button/Button';
import { chains } from '@/network/chains';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import styles from './rpc-settings-modal.module.scss';

export type RpcSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRpcChange: (relayUrl: string, coretimeUrl: string) => void;
};

const RpcSettingsModal: React.FC<RpcSettingsModalProps> = ({ isOpen, onClose, onRpcChange }) => {
  const network = useUnit($network);
  const [selectedRelayRpc, setSelectedRelayRpc] = useState<string>('');
  const [selectedCoretimeRpc, setSelectedCoretimeRpc] = useState<string>('');
  const [customRelayRpc, setCustomRelayRpc] = useState<string>('');
  const [customCoretimeRpc, setCustomCoretimeRpc] = useState<string>('');

  useEffect(() => {
    if (!network) return;
    const relayKey = network.toLowerCase();
    const coretimeKey = `${relayKey}Coretime` as keyof typeof chains;
    const relayChain = chains[relayKey as keyof typeof chains];
    const coretimeChain = chains[coretimeKey];
    setSelectedRelayRpc(relayChain?.nodes?.[0]?.url || '');
    setSelectedCoretimeRpc(coretimeChain?.nodes?.[0]?.url || '');
  }, [network]);

  if (!isOpen || !network) return null;

  const relayKey = network.toLowerCase();
  const coretimeKey = `${relayKey}Coretime` as keyof typeof chains;
  const relayChain = chains[relayKey as keyof typeof chains];
  const coretimeChain = chains[coretimeKey];

  const relayRpcs = relayChain?.nodes || [];
  const coretimeRpcs = coretimeChain?.nodes || [];

  const isValidWsUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'wss:' || parsed.protocol === 'ws:';
    } catch {
      return false;
    }
  };

  const testWebSocket = (url: string, timeout = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(url);
        const timer = setTimeout(() => {
          ws.close();
          resolve(false);
        }, timeout);

        ws.onopen = () => {
          clearTimeout(timer);
          ws.close();
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSave = async () => {
    const relayUrl = customRelayRpc || selectedRelayRpc || relayRpcs[0]?.url;
    const coretimeUrl = customCoretimeRpc || selectedCoretimeRpc || coretimeRpcs[0]?.url;

    if (!isValidWsUrl(relayUrl) || !isValidWsUrl(coretimeUrl)) {
      alert('Please enter valid WebSocket URLs (must start with ws:// or wss://)');
      return;
    }

    const [relayAlive, coretimeAlive] = await Promise.all([
      testWebSocket(relayUrl),
      testWebSocket(coretimeUrl),
    ]);

    if (!relayAlive || !coretimeAlive) {
      alert('One or both RPC endpoints are unreachable. Please check the URLs and try again.');
      return;
    }

    console.log('Selected Relay RPC:', relayUrl);
    console.log('Selected Coretime RPC:', coretimeUrl);
    onRpcChange(relayUrl, coretimeUrl);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <div className={styles.header}>
          <h2 className={styles.title}>Change RPC Provider</h2>
        </div>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <label className={styles.label}>Select Relay RPC</label>
            <Select
              selectedValue={selectedRelayRpc}
              onChange={(val) => setSelectedRelayRpc(val as string)}
              options={relayRpcs.map((node) => ({
                key: node.url,
                value: node.url,
                label: node.url,
              }))}
            />
          </div>

          <div className={styles.detailItem}>
            <label className={styles.label}>Custom Relay RPC (optional)</label>
            <input
              className={styles.input}
              value={customRelayRpc}
              onChange={(e) => setCustomRelayRpc(e.target.value)}
              placeholder='wss://...'
            />
          </div>

          <div className={styles.detailItem}>
            <label className={styles.label}>Select Coretime RPC</label>
            <Select
              selectedValue={selectedCoretimeRpc}
              onChange={(val) => setSelectedCoretimeRpc(val as string)}
              options={coretimeRpcs.map((node) => ({
                key: node.url,
                value: node.url,
                label: node.url,
              }))}
            />
          </div>

          <div className={styles.detailItem}>
            <label className={styles.label}>Custom Coretime RPC (optional)</label>
            <input
              className={styles.input}
              value={customCoretimeRpc}
              onChange={(e) => setCustomCoretimeRpc(e.target.value)}
              placeholder='wss://...'
            />
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default RpcSettingsModal;
