import NetworkSelector from "@/components/NetworkSelector";
import styles from "./home.module.scss";
import { createPolkadotClientFx } from "@/api/connection";
import { chains } from "@/api/chains";
import { $connections } from "@/api/connection";
import { useUnit } from "effector-react";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    createPolkadotClientFx(chains.polkadotCoretime);
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
