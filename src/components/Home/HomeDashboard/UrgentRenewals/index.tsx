'use client';

import styles from './UrgentRenewals.module.scss';
import Select from '@/components/elements/Select';
import { toUnitFormatted } from '@/utils';
import { Toaster } from 'react-hot-toast';
import { MultiChainAccountData } from '@/account';
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

  const urgentCount = options.length;

  return (
    <div
      className={`${styles.renewableCoresCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <p className={styles.title}>Urgent Renewals</p>
          </div>

          <div className={styles.interludeBadge}>
            <span className={styles.interludeLabel}>
              {interludeEnded ? 'Interlude ended' : 'Interlude ends'}
            </span>
            <span className={styles.interludeDate}>
              {interludeEndDate ? formatDate(interludeEndDate) : '-'}
            </span>
          </div>
        </div>

        <div className={styles.selectorRow}>
          {hasRenewables ? (
            <>
              <span className={styles.selectorLabel}>Select parachain</span>
              <Select
                options={options}
                selectedValue={selected}
                onChange={setSelected}
                variant='secondary'
                searchable
                searchPlaceholder='Search parachain'
              />
            </>
          ) : (
            <p className={styles.noDataMessage}>
              All cores have been renewed. Nothing left to renew!
            </p>
          )}
        </div>

        {hasRenewables && (
          <div className={styles.tableWrapper}>
            <div className={styles.statsTable}>
              <div className={styles.statsHeader}>
                <span>Metric</span>
                <span>Value</span>
              </div>

              <div className={styles.statsRow}>
                <span className={styles.labelCell}>Renewal price</span>
                <span className={styles.valueCell}>
                  {selected ? toUnitFormatted(network, BigInt(selected[1].price)) : '-'}
                </span>
              </div>

              <div className={styles.statsRow}>
                <span className={styles.labelCell}>Renewal deadline</span>
                <span className={styles.valueCell}>{selectedDeadline}</span>
              </div>

              <div className={styles.statsRow}>
                <span className={styles.labelCell}>Status</span>
                <span className={styles.valueCell}>
                  {allCoresSold ? 'Sold out' : interludeEnded ? 'Sale ongoing' : 'Interlude'}
                </span>
              </div>
            </div>
          </div>
        )}

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
          disabled={disableRenew}
          title={
            disableRenew
              ? allCoresSold
                ? 'All cores are sold'
                : !selectedAccount
                  ? 'Account not selected'
                  : !selected
                    ? 'Select a core to renew'
                    : undefined
              : undefined
          }
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
