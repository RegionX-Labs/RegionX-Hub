import NetworkSelector from "@/components/NetworkSelector";
import styles from "./home.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Coretime Hub V2
        <NetworkSelector />
      </h1>
    </div>
  );
}
