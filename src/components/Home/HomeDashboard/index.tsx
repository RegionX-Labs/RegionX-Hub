import RenewableCores from './RenewableCores';
import CoreComparison from './CoreComparison';
import DutchAuctionChart from './DutchAuctionChart';
import AuctionPhaseStatus from './AuctionPhaseStatus';
import CoreRemaining from './CoreRemaining';
import styles from './HomeDashboard.module.scss';

export default function HomeDashboard() {
  return (
    <div className={styles.dashboard}>
      <RenewableCores />
      <CoreComparison />
      <AuctionPhaseStatus />
      <DutchAuctionChart />
      <CoreRemaining />
    </div>
  );
}
