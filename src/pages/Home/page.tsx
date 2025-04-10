import styles from './home.module.scss';
import Header from '@/components/Header';
import GeneralAnalytics from '@/components/GeneralAnalytics';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <GeneralAnalytics />
    </div>
  );
}
