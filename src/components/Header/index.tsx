import { useState } from "react";
import { useUnit } from "effector-react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./header.module.scss";
import AccountSelector from "@/components/AccountSelector";
import NetworkSelector from "@/components/NetworkSelector";
import WalletModal from "../WalletModal/WalletModal";
import CoretimeMenu from "../CoretimeMenu/index";
import { Button } from "@region-x/components";
import { $loadedAccounts } from "@/wallet";

const Header: React.FC = () => {
  const accounts = useUnit($loadedAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(`/${path}`);
  };

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
          <li className={styles.navItem} onClick={() => handleNavigation("")}>
            Home
          </li>
          <CoretimeMenu />
          <li
            className={styles.navItem}
            onClick={() => handleNavigation("cross-chain")}
          >
            Cross-Chain
          </li>
          <li
            className={styles.navItem}
            onClick={() => handleNavigation("parachain-dashboard")}
          >
            Parachain Dashboard
          </li>
          <li
            className={styles.navItem}
            onClick={() => handleNavigation("secondary-market")}
          >
            Secondary Market
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        {accounts.length > 0 ? (
          <>
            <div className={styles.accSelector}>
              <AccountSelector />
            </div>
            <div className={styles.networkSelector}>
              <NetworkSelector />
            </div>
          </>
        ) : (
          <Button onClick={() => setIsModalOpen(true)}>Connect Wallet</Button>
        )}
      </div>

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Header;
