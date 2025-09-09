'use client';

import React from 'react';
import { useUnit } from 'effector-react';
import { useRouter } from 'next/router';

import styles from './UserBalance.module.scss';
import { $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { $accountData } from '@/account';
import { toUnitFormatted } from '@/utils';

export default function UserBalance() {
  const router = useRouter();
  const [network, selectedAccount, accountDataMap] = useUnit([
    $network,
    $selectedAccount,
    $accountData,
  ]);

  if (!selectedAccount || !accountDataMap) return null;

  const accountData = accountDataMap[selectedAccount.address];
  if (!accountData || !accountData.coretimeChainData || !accountData.relayChainData) return null;

  const networkKnown = typeof network === 'string' && network.trim().length > 0;
  const isKusama = networkKnown && network!.toLowerCase().includes('kusama');

  const relayFree = toUnitFormatted(network, accountData.relayChainData.free);
  const coretimeFree = toUnitFormatted(network, accountData.coretimeChainData.free);
  const regionxFree = toUnitFormatted(network, accountData.regionxChainData?.free ?? BigInt(0));

  const handleTransferClick = () => router.push('/cross-chain');

  const gridColsClass = isKusama ? styles.cols3 : styles.cols2;

  return (
    <div className={styles.metricBox}>
      <div className={styles.titleRow}>
        <span className={styles.metricLabel}>Your Balances</span>
        <span className={styles.badge}>{isKusama ? 'Kusama' : 'Polkadot'}</span>
      </div>

      <div className={`${styles.balanceGrid} ${gridColsClass}`}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>Relay Chain</div>
          <div className={styles.balanceValue}>{relayFree}</div>
        </div>

        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>Coretime Chain</div>
          <div className={styles.balanceValue}>{coretimeFree}</div>
        </div>

        {isKusama && (
          <div className={styles.balanceCard}>
            <div className={styles.balanceLabel}>RegionX Chain</div>
            <div className={styles.balanceValue}>{regionxFree}</div>
          </div>
        )}
      </div>

      <p className={styles.infoText}>
        This balance is used to <strong>purchase</strong> or <strong>renew</strong> a core.
      </p>
      <p className={styles.note}>
        To fund your account on the Coretime chain, you must transfer tokens from the Relay Chain to
        the Coretime Chain.
      </p>

      <button className={styles.transferButton} onClick={handleTransferClick}>
        Transfer
      </button>
    </div>
  );
}
