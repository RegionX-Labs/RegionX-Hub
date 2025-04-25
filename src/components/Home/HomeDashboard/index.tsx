import RenewableCores from './RenewableCores';
import CoreComparison from './CoreComparison';
import DutchAuctionChart from './DutchAuctionChart';
import AuctionPhaseStatus from './AuctionPhaseStatus';
import styles from './HomeDashboard.module.scss';

export default function HomeDashboard() {
  return (
    <div className={styles.dashboard}>
      <RenewableCores />
      <CoreComparison />
      <AuctionPhaseStatus />
      <DutchAuctionChart />
    </div>
  );
}
