import React, { useState, useEffect } from 'react';
import Select from '../../components/elements/Select';
import Button from '../../components/elements/Button/Button';
import { chains } from '@/network/chains';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';
import styles from './rpc-settings-modal.module.scss';
import { RPC_SETTINGS_KEY, RpcSettings } from '@/constants/rpc';

export type RpcSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRpcChange: (assetHubUrl: string, coretimeUrl: string) => void;
};

const RpcSettingsModal: React.FC<RpcSettingsModalProps> = ({ isOpen, onClose, onRpcChange }) => {
  const network = useUnit($network);
  const [selectedAssetHubRpc, setSelectedAssetHubRpc] = useState<string>('');
  const [selectedCoretimeRpc, setSelectedCoretimeRpc] = useState<string>('');
  const [customAssetHubRpc, setCustomAssetHubRpc] = useState<string>('');
  const [customCoretimeRpc, setCustomCoretimeRpc] = useState<string>('');

  useEffect(() => {
    if (!network || !isOpen) return;
    const networkKey = network.toLowerCase();
    const coretimeKey = `${networkKey}Coretime` as keyof typeof chains;
    const assetHubKey = `${networkKey}AH` as keyof typeof chains;
    const assetHubChain = chains[assetHubKey];
    const coretimeChain = chains[coretimeKey];
    const assetHubRpcs = assetHubChain?.nodes || [];
    const coretimeRpcs = coretimeChain?.nodes || [];

    let storedAssetHub = '';
    let storedCoretime = '';
    const storedRaw = localStorage.getItem(RPC_SETTINGS_KEY);
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw) as RpcSettings;
        storedAssetHub = parsed?.[network]?.assetHubUrl || parsed?.[network]?.relayUrl || '';
        storedCoretime = parsed?.[network]?.coretimeUrl || '';
      } catch {
        storedAssetHub = '';
        storedCoretime = '';
      }
    }

    const assetHubUrl = storedAssetHub || assetHubRpcs[0]?.url || '';
    const coretimeUrl = storedCoretime || coretimeRpcs[0]?.url || '';

    setSelectedAssetHubRpc(assetHubUrl);
    setSelectedCoretimeRpc(coretimeUrl);
    setCustomAssetHubRpc(
      storedAssetHub && !assetHubRpcs.some((node) => node.url === storedAssetHub)
        ? storedAssetHub
        : ''
    );
    setCustomCoretimeRpc(
      storedCoretime && !coretimeRpcs.some((node) => node.url === storedCoretime)
        ? storedCoretime
        : ''
    );
  }, [network, isOpen]);

  if (!isOpen || !network) return null;

  const networkKey = network.toLowerCase();
  const coretimeKey = `${networkKey}Coretime` as keyof typeof chains;
  const assetHubKey = `${networkKey}AH` as keyof typeof chains;
  const assetHubChain = chains[assetHubKey];
  const coretimeChain = chains[coretimeKey];

  const assetHubRpcs = assetHubChain?.nodes || [];
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
    const assetHubUrl = customAssetHubRpc || selectedAssetHubRpc || assetHubRpcs[0]?.url;
    const coretimeUrl = customCoretimeRpc || selectedCoretimeRpc || coretimeRpcs[0]?.url;

    if (!isValidWsUrl(assetHubUrl) || !isValidWsUrl(coretimeUrl)) {
      alert('Please enter valid WebSocket URLs (must start with ws:// or wss://)');
      return;
    }

    const [assetHubAlive, coretimeAlive] = await Promise.all([
      testWebSocket(assetHubUrl),
      testWebSocket(coretimeUrl),
    ]);

    if (!assetHubAlive || !coretimeAlive) {
      alert('One or both RPC endpoints are unreachable. Please check the URLs and try again.');
      return;
    }

    console.log('Selected Asset Hub RPC:', assetHubUrl);
    console.log('Selected Coretime RPC:', coretimeUrl);
    onRpcChange(assetHubUrl, coretimeUrl);
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
            <label className={styles.label}>Select Asset Hub RPC</label>
            <Select
              selectedValue={selectedAssetHubRpc}
              onChange={(val) => setSelectedAssetHubRpc(val as string)}
              options={assetHubRpcs.map((node) => ({
                key: node.url,
                value: node.url,
                label: node.url,
              }))}
            />
          </div>

          <div className={styles.detailItem}>
            <label className={styles.label}>Custom Asset Hub RPC (optional)</label>
            <input
              className={styles.input}
              value={customAssetHubRpc}
              onChange={(e) => setCustomAssetHubRpc(e.target.value)}
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
