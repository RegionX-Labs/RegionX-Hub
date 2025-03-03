import Image from "next/image";
import styles from "./header.module.scss";
import AccountSelector from "@/components/AccountSelector";
import NetworkSelector from "@/components/NetworkSelector";

const Header = () => {
  return (
    <nav className={styles.navbar}>
      <Image
        src="/logo.png"
        alt="Logo"
        className={styles.logo}
        width={1463}
        height={391}
      />
      <div className={styles.list}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>Home</li>
          <li className={styles.navItem}>Coretime</li>
          <li className={styles.navItem}>Cross-Chain</li>
          <li className={styles.navItem}>Parachain Dashboard</li>
          <li className={styles.navItem}>Secondary Market</li>
        </ul>
      </div>
      <div className={styles.content}>
        <div className={styles.accSelector}>
          <AccountSelector />
        </div>

        <div className={styles.networkSelector}>
          <NetworkSelector />
        </div>
      </div>
    </nav>
  );
};

export default Header;
