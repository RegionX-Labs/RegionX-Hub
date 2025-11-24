'use client';

import styles from './UrgentRenewals.module.scss';
import Select from '@/components/elements/Select';
import { toUnitFormatted } from '@/utils';
import { Toaster } from 'react-hot-toast';
import { MultiChainAccountData, getAccountData } from '@/account';
import TransactionModal from '@/components/TransactionModal';
import AutoRenewalModal from '@/components/AutoRenewalModal';
import { useUrgentRenewals } from './hook';

type Props = { view: string };

const formatDate = (d: Date) =>
  d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function UrgentRenewals({ view }: Props) {
  const {
    accountData,
    network,
    selectedAccount,
    options,
    selected,
    setSelected,
    selectedDeadline,
    hasRenewables,
    interludeEnded,
    interludeEndDate,
    bannerMsg,
    autoRenewEnabled,
    allCoresSold,
    disableRenew,
    disableAutoRenew,
    paraId,
    isModalOpen,
    isAutoRenewOpen,
    openModal,
    onModalConfirm,
    closeModal,
    handleOpenAutoRenew,
    closeAutoRenew,
  } = useUrgentRenewals();

  return (
    <div
      className={`${styles.renewableCoresCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <div className={styles.content}>
        <p className={styles.title}>Urgent Renewals</p>

        <div className={styles.selectBox}>
          {hasRenewables ? (
            <Select
              options={options}
              selectedValue={selected}
              onChange={setSelected}
              variant='secondary'
              searchable
              searchPlaceholder='Search parachain'
            />
          ) : (
            <p className={styles.noDataMessage}>
              All cores have been renewed. Nothing left to renew!
            </p>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.detailBlock}>
            <p className={styles.label}>Renewal Price</p>
            <p className={styles.value}>
              {selected ? toUnitFormatted(network, BigInt(selected[1].price)) : '-'}
            </p>
          </div>

          <div className={styles.detailBlock}>
            <p className={styles.label}>Renewal deadline</p>
            <p className={styles.value}>{selectedDeadline}</p>
          </div>
        </div>

        <div className={styles.interludeSection}>
          <p className={styles.interludeHeading}>
            {interludeEnded ? 'Interlude ended' : 'Interlude ends'}
          </p>
          <p className={styles.interludeValue}>
            {interludeEndDate ? formatDate(interludeEndDate) : '-'}
          </p>
        </div>

        {bannerMsg && (
          <div
            className={`${styles.notice} ${
              allCoresSold ? styles.noticeError : styles.noticeWarning
            }`}
          >
            {bannerMsg}
          </div>
        )}
      </div>

      <div className={styles.buttonRow}>
        <button
          className={styles.renewButton}
          onClick={openModal}
          title={disableRenew && allCoresSold ? 'All cores are sold' : undefined}
        >
          Renew Now
        </button>

        {hasRenewables && (
          <button
            className={
              autoRenewEnabled
                ? `${styles.autoRenewButton} ${styles.autoRenewButtonEnabled}`
                : styles.autoRenewButton
            }
            onClick={handleOpenAutoRenew}
            disabled={disableAutoRenew}
            title={
              disableAutoRenew
                ? !selectedAccount
                  ? 'Account not selected'
                  : 'Select a core to manage auto-renewal'
                : undefined
            }
          >
            {autoRenewEnabled ? 'Auto-Renewal Enabled' : 'Enable Auto-Renewal'}
          </button>
        )}
      </div>

      {selectedAccount && accountData[selectedAccount.address] !== null && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={closeModal}
          onConfirm={onModalConfirm}
        />
      )}

      {selected && (
        <AutoRenewalModal
          isOpen={isAutoRenewOpen}
          onClose={closeAutoRenew}
          paraId={paraId ?? 0}
          coreId={selected[0].core}
        />
      )}

      <Toaster />
    </div>
  );
}
