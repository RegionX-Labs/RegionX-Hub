import styles from './home.module.scss';
import Header from '@/components/Header';
import GeneralAnalytics from '@/components/Home/GeneralAnalytics';
import MyCore from '@/components/Home/MyCore';
import CoreComparison from '@/components/Home/CoreComparison';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <GeneralAnalytics />
      <MyCore />
      <CoreComparison />
    </div>
  );
}
