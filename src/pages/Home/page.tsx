import NetworkSelector from "@/components/NetworkSelector";
import styles from "./home.module.scss";
import {Accounts, Wallets} from "@/components/Wallet";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Coretime Hub V2
        <NetworkSelector />
        <Wallets />
        <Accounts />
      </h1>
    </div>
  );
}
