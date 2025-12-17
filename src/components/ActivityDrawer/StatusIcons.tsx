import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import styles from './ActivityDrawer.module.scss';
import { TxStatus } from './useActivityData';

const ICON_SIZE = 18;
const ICON_STROKE = 2.25;

export const StatusIcon = ({ status }: { status: TxStatus }) => {
  if (status === 'pending')
    return <Loader2 className={styles.spin} size={ICON_SIZE} strokeWidth={ICON_STROKE} />;
  if (status === 'success') return <CheckCircle2 size={ICON_SIZE} strokeWidth={ICON_STROKE} />;
  return <AlertTriangle size={ICON_SIZE} strokeWidth={ICON_STROKE} />;
};

export const StatusPill = ({ status }: { status: TxStatus }) => (
  <span className={`${styles.status} ${styles[status]}`}>{status}</span>
);
