import styles from './dashboardModal.module.scss';
import Button from '../elements/Button/Button';
import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import { Network } from '@/types';
import { toUnitFormatted } from '../../utils/index';
import toast, { Toaster } from 'react-hot-toast';
import { getAccountData } from '@/account';
import { $selectedAccount } from '@/wallet';
import { SUBSCAN_RELAY_URL } from '@/pages/coretime/sale-history';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const [nextParaId, setNextParaId] = useState<number | null>(null);
  const [reservationCost, setReservationCost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const network = useUnit($network);
  const connections = useUnit($connections);
  const selectedAccount = useUnit($selectedAccount);

  useEffect(() => {
    if (!isOpen) return;

    const fetchParaIdData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const networkChainIds = getNetworkChainIds(network);
        if (!networkChainIds) {
          throw new Error('Network chain IDs not found');
        }

        const connection = connections[networkChainIds.relayChain];
        if (!connection || !connection.client || connection.status !== 'connected') {
          throw new Error('Connection not available');
        }

        const client = connection.client;
        const metadata = getNetworkMetadata(network);
        if (!metadata) {
          throw new Error('Network metadata not found');
        }

        const nextId = await client
          .getTypedApi(metadata.relayChain)
          .query.Registrar.NextFreeParaId.getValue();
        setNextParaId(Number(nextId));

        const paraDeposit = await client
          .getTypedApi(metadata.relayChain)
          .constants.Registrar.ParaDeposit();
        setReservationCost(toUnitFormatted(network, paraDeposit));
      } catch (err) {
        console.error('Failed to fetch para ID data:', err);
        setError('Failed to load reservation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParaIdData();
  }, [isOpen, network, connections]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const reserveParaId = async () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.relayChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    const tx = client.getTypedApi(metadata.relayChain).tx.Registrar.reserve();

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(
          <span>
            Transaction submitted:&nbsp;
            <a
              href={`${SUBSCAN_RELAY_URL[network]}/extrinsic/${ev.txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: 'underline', color: '#60a5fa' }}
            >
              view transaction
            </a>
          </span>,
          { id: toastId }
        );
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed', { id: toastId });
            console.log(err);
          } else {
            toast.success('Transaction succeded!', { id: toastId });
            getAccountData({ account: selectedAccount.address, connections, network });
          }
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label='Close modal'>
          ×
        </button>

        <h2 className={styles.modalTitle}>Reserve Para ID</h2>
        <p className={styles.modalSubtitle}>Reserve your Para ID for the future</p>

        {isLoading ? (
          <div className={styles.loading}>Loading reservation data...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.infoContainer}>
            <div className={styles.infoBox}>
              <span>Next paraId available to reserve:</span>
              <strong>{nextParaId ?? 'N/A'}</strong>
            </div>
            <div className={styles.infoBox}>
              <span>Reservation cost:</span>
              <strong>{reservationCost ? `${reservationCost} ` : 'N/A'}</strong>
            </div>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <div className={styles.reserveButton}>
            <Button onClick={reserveParaId} disabled={isLoading || error !== null}>
              {isLoading ? 'Loading...' : 'Reserve'}
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default DashboardModal;
