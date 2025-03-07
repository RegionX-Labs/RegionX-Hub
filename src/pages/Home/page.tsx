import styles from './home.module.scss';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
    </div>
  );
}
