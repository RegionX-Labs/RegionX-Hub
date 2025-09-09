'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './warning-modal.module.scss';

type WarningModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  labelledById?: string;
  zIndex?: number;
};

const WarningModal: React.FC<WarningModalProps> = ({
  open,
  title = 'Warning',
  onClose,
  children,
  footer,
  closeOnOverlayClick = true,
  labelledById,
  zIndex,
}) => {
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const headingId = labelledById ?? 'warning-modal-title';

  const overlayStyle = zIndex ? { zIndex } : undefined;

  return createPortal(
    <div
      className={styles.overlay}
      style={overlayStyle}
      onClick={(e) => {
        if (!closeOnOverlayClick) return;
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className={styles.modal} role='dialog' aria-modal='true' aria-labelledby={headingId}>
        <div className={styles.header}>
          <h3 id={headingId} className={styles.title}>
            {title}
          </h3>
          <button className={styles.close} aria-label='Close' onClick={close}>
            ×
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        <div className={styles.footer}>
          {footer ?? (
            <button className={styles.btnGhost} onClick={close}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WarningModal;
