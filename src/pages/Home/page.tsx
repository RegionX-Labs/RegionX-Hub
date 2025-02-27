import NetworkSelector from "@/components/NetworkSelector";
import styles from "./home.module.scss";
import { chainConnected, createPolkadotClientFx, initChains, networkStarted } from "@/api/connection";
import { chains } from "@/api/chains";
import { $connections } from "@/api/connection";
import { useUnit } from "effector-react";
import { useEffect } from "react";
import { Network } from "@/types";

export default function Home() {
  useEffect(() => {
    // networkStarted(Network.POLKADOT);
    initChains();
    // chainConnected(chains.polkadotCoretime.chainId);
  }, []);

  const connections = useUnit($connections)

  console.log(connections);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Coretime Hub V2
        <NetworkSelector />
      </h1>
    </div>
  );
}
