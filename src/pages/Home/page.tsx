import NetworkSelector from "@/components/NetworkSelector";
import styles from "./home.module.scss";
import { initChains } from "@/api/connection";
import { useEffect } from "react";
import { Network } from "@/types";

export default function Home() {
  useEffect(() => {
    // networkStarted(Network.POLKADOT);
    initChains(Network.KUSAMA);
    // chainConnected(chains.polkadotCoretime.chainId);
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Coretime Hub V2
        <NetworkSelector />
      </h1>
    </div>
  );
}
