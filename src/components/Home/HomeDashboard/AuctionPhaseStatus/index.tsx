import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import styles from './AuctionPhaseStatus.module.scss';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AuctionPhaseStatus() {
  const progress = 80;

  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      offsetY: 0,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        track: {
          background: '#2E2E2E',
          strokeWidth: '100%',
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            offsetY: 4,
            fontSize: '18px',
            fontWeight: 600,
            color: '#fff',
            formatter: () => `${progress}%`,
          },
        },
        hollow: {
          size: '60%',
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#00E676'],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };

  const series = [progress];

  return (
    <div className={styles.auctionPhaseCard}>
      <div className={styles.header}>Auction Phase Status</div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.label}>Current Phase</div>
          <div className={styles.value}>Secondary Market</div>
          <div className={styles.label}>Next Phase in</div>
          <div className={styles.value}>30 Minutes</div>
        </div>
        <div className={styles.progressWrapper}>
          <Chart options={options} series={series} type="radialBar" height={200} />
        </div>
      </div>
    </div>
  );
}
