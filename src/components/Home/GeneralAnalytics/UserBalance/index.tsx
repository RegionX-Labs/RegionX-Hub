import { useUnit } from 'effector-react';
import styles from './UserBalance.module.scss';
import { $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { $accountData } from '@/account';
import { toUnitFormatted } from '@/utils';
import { useRouter } from 'next/router';

export default function UserBalance() {
  const [network, selectedAccount, accountDataMap] = useUnit([
    $network,
    $selectedAccount,
    $accountData,
  ]);

  if (!selectedAccount || !accountDataMap) return null;

  const accountData = accountDataMap[selectedAccount.address];
  if (!accountData || !accountData.coretimeChainData) return null;

  const formatted = toUnitFormatted(network, accountData.coretimeChainData.free);
  const router = useRouter();

  const handleTransferClick = () => {
    router.push('/cross-chain');
  };

  return (
    <div className={styles.metricBox}>
      <span className={styles.metricLabel}>Coretime Chain Balance</span>
      <h3 className={styles.coretimeValue}>{formatted}</h3>
      <p className={styles.note}>
        This balance is used to <strong>purchase</strong> and <strong>renew</strong> coretime in
        auctions. To fund this balance, you must transfer tokens <br></br>{' '}
        <strong>cross-chain</strong> from the Relay Chain to the Coretime Chain.
      </p>
      <button className={styles.transferButton} onClick={handleTransferClick}>
        Transfer to Coretime Chain
      </button>
    </div>
  );
}
