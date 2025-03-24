import styles from './dashboardModal.module.scss';
import { Button } from '@region-x/components';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
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

        <div className={styles.infoContainer}>
          <div className={styles.infoBox}>
            <span>Next paraId available to reserve:</span>
            <strong>3417</strong>
          </div>
          <div className={styles.infoBox}>
            <span>Reservation cost:</span>
            <strong>100 DOT</strong>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.reserveButton}>
            <Button>Reserve</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;
