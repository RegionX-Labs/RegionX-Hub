'use client';

import React, { useEffect, useState } from 'react';
import styles from './AutoRenewalModal.module.scss';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  paraId?: number | string;
  defaultRpc?: string;
};

const AutoRenewalModal: React.FC<Props> = ({ isOpen, onClose, paraId, defaultRpc }) => {
  const [rpc, setRpc] = useState(defaultRpc ?? '');
  const [fundBoth, setFundBoth] = useState(false);
  const [fundRelay, setFundRelay] = useState(false);
  const [fundCoretime, setFundCoretime] = useState(false);
  const [openHrmp, setOpenHrmp] = useState(false);
  const [enableAutoRenew, setEnableAutoRenew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRpc(defaultRpc ?? '');
      setFundBoth(false);
      setFundRelay(false);
      setFundCoretime(false);
      setOpenHrmp(false);
      setEnableAutoRenew(false);
    }
  }, [isOpen, defaultRpc]);

  if (!isOpen) return null;

  const closeByOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={closeByOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Auto-Renewal</h2>
          <p className={styles.subtitle}>
            Pick an RPC, make sure fee pots are topped up, and choose HRMP + auto-renewal prefs.
          </p>
          {paraId !== undefined && <div className={styles.pillLarge}>ParaID: {paraId}</div>}
        </div>

        <div className={styles.section}>
          <label className={styles.label}>RPC endpoint</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputPrefix}>RPC</span>
            <input
              className={styles.input}
              placeholder='wss://your-rpc-endpoint'
              value={rpc}
              onChange={(e) => setRpc(e.target.value)}
            />
            {rpc && (
              <button
                type='button'
                className={styles.clearBtn}
                onClick={() => setRpc('')}
                aria-label='Clear RPC'
              >
                ×
              </button>
            )}
          </div>
          <p className={styles.help}>
            Used for checks and future renewals. You can change this whenever you like.
          </p>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.iconDot} aria-hidden />
            <div className={styles.optionText}>
              <div className={styles.optionTitle}>Fund the sovereign accounts</div>
              <div className={styles.optionSub}>
                Single action that funds both Relay and Coretime fee pots.
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type='checkbox'
                checked={fundBoth}
                onChange={(e) => setFundBoth(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.iconDot} aria-hidden />
            <div className={styles.optionText}>
              <div className={styles.optionTitle}>
                Fund sovereign account on <b>Relay</b>
                <span className={styles.badge}>Recommended</span>
              </div>
              <div className={styles.optionSub}>Covers HRMP calls and relay-side fees.</div>
            </div>
            <label className={styles.switch}>
              <input
                type='checkbox'
                checked={fundRelay}
                onChange={(e) => setFundRelay(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
          <div className={styles.kv}>
            <span>Current Relay balance</span>
            <code className={styles.mono}>0</code>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.iconDot} aria-hidden />
            <div className={styles.optionText}>
              <div className={styles.optionTitle}>
                Fund sovereign account on <b>Coretime</b>
              </div>
              <div className={styles.optionSub}>
                Ensures XCM renewals and future messages don’t run out of fees.
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type='checkbox'
                checked={fundCoretime}
                onChange={(e) => setFundCoretime(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
          <div className={styles.kv}>
            <span>Current Coretime balance</span>
            <code className={styles.mono}>0</code>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.iconDot} aria-hidden />
            <div className={styles.optionText}>
              <div className={styles.optionTitle}>Open HRMP channel</div>
              <div className={styles.optionSub}>
                Creates the route between your parachain and the Coretime system chain.
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type='checkbox'
                checked={openHrmp}
                onChange={(e) => setOpenHrmp(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.iconDot} aria-hidden />
            <div className={styles.optionText}>
              <div className={styles.optionTitle}>Enable auto-renew</div>
              <div className={styles.optionSub}>
                If the current core isn’t eligible, this just saves the preference for next cycles.
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type='checkbox'
                checked={enableAutoRenew}
                onChange={(e) => setEnableAutoRenew(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.ghost} onClick={onClose}>
            Close
          </button>
          <button className={styles.primary} onClick={onClose}>
            Save settings
          </button>
        </div>

        <button className={styles.close} onClick={onClose} aria-label='Close modal'>
          ×
        </button>
      </div>
    </div>
  );
};

export default AutoRenewalModal;
