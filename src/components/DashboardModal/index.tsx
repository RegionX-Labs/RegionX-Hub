import styles from './dashboardModal.module.scss';
import { Button } from '@region-x/components';
import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import { Network } from '@/types';
import { toUnitFormatted } from '../../utils/index';

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

  const getTokenSymbol = (): string => {
    switch (network) {
      case Network.POLKADOT:
        return 'DOT';
      case Network.KUSAMA:
        return 'KSM';
      case Network.PASEO:
        return 'PAS';
      case Network.WESTEND:
        return 'WND';
      default:
        return 'TOKEN';
    }
  };

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

        const nextId = await (
          client.getTypedApi(metadata.relayChain) as any
        ).query.Registrar.NextFreeParaId.getValue();
        setNextParaId(Number(nextId));

        const paraDeposit = await (client.getTypedApi(metadata.relayChain) as any).query.Registrar
          .ParaDeposit;
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
              <strong>{reservationCost ? `${reservationCost} ${getTokenSymbol()}` : 'N/A'}</strong>
            </div>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <div className={styles.reserveButton}>
            <Button disabled={isLoading || error !== null}>
              {isLoading ? 'Loading...' : 'Reserve'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;
