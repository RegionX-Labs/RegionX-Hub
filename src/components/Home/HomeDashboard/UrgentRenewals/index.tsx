'use client';

import styles from './UrgentRenewals.module.scss';
import { toUnitFormatted } from '@/utils';
import { Toaster } from 'react-hot-toast';
import { MultiChainAccountData } from '@/account';
import TransactionModal from '@/components/TransactionModal';
import AutoRenewalModal from '@/components/AutoRenewalModal';
import { TableComponent } from '@/components/elements/TableComponent';
import { TableData } from '@/types/type';
import { useMemo } from 'react';
import { useUrgentRenewals } from './hook';

type Props = { view: string };

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
    autoRenewEnabled,
    allCoresSold,
    paraId,
    isModalOpen,
    isAutoRenewOpen,
    openModal,
    onModalConfirm,
    closeModal,
    handleOpenAutoRenew,
    closeAutoRenew,
    deadlines,
  } = useUrgentRenewals();

  const getParaIdFromRecord = (record: any): number | null => {
    try {
      return (record.completion as any)?.value?.[0]?.assignment?.value ?? null;
    } catch {
      return null;
    }
  };

  const tableData = useMemo<Record<string, TableData>[]>(() => {
    if (!hasRenewables || !network) return [];

    return options.map((option) => {
      const [key, record] = option.value;
      const isSelected =
        selected?.[0].core === key.core && selected?.[0].when === key.when && selected?.[1] === record;
      const label = option.label.trim();
      const deadline = deadlines[`${key.when}-${key.core}`] ?? selectedDeadline;
      const paraIdForRow = getParaIdFromRecord(record);
      const autoRenewDisabled = !selectedAccount || typeof paraIdForRow !== 'number';
      const rowAutoRenewEnabled = isSelected && autoRenewEnabled;
      const renewDisabled = !selectedAccount || allCoresSold;

      return {
        Parachain: {
          cellType: 'jsx',
          data: (
            <div className={styles.parachainCell}>
              {option.icon}
              <span>{label}</span>
            </div>
          ),
          searchKey: label,
        },
        'Core ID': {
          cellType: 'text',
          data: key.core.toString(),
          searchKey: key.core.toString(),
        },
        Price: {
          cellType: 'text',
          data: toUnitFormatted(network, BigInt(record.price)),
          searchKey: record.price.toString(),
        },
        Deadline: {
          cellType: 'text',
          data: deadline,
          searchKey: deadline,
        },
        Actions: {
          cellType: 'jsx',
          data: (
            <div className={styles.actionButtons}>
              <button
                className={styles.renewButton}
                onClick={() => {
                  setSelected(option.value);
                  openModal(option.value);
                }}
                disabled={renewDisabled}
                title={renewDisabled && allCoresSold ? 'All cores are sold' : undefined}
              >
                Renew
              </button>
              <button
                className={
                  rowAutoRenewEnabled
                    ? `${styles.autoRenewButton} ${styles.autoRenewButtonEnabled}`
                    : styles.autoRenewButton
                }
                onClick={() => {
                  setSelected(option.value);
                  handleOpenAutoRenew(option.value);
                }}
                disabled={autoRenewDisabled}
                title={
                  autoRenewDisabled
                    ? !selectedAccount
                      ? 'Account not selected'
                      : 'Select a core to manage auto-renewal'
                    : undefined
                }
              >
                {rowAutoRenewEnabled ? 'Auto-Renewal Enabled' : 'Enable Auto-Renewal'}
              </button>
            </div>
          ),
        },
      };
    });
  }, [
    hasRenewables,
    network,
    options,
    selected,
    setSelected,
    deadlines,
    selectedDeadline,
    selectedAccount,
    autoRenewEnabled,
    allCoresSold,
    openModal,
    handleOpenAutoRenew,
  ]);

  return (
    <div
      className={`${styles.renewableCoresCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <div className={styles.content}>
        <p className={styles.title}>Urgent Renewals</p>

        <div className={styles.tableWrapper}>
          {hasRenewables ? (
            <TableComponent data={tableData} pageSize={5} />
          ) : (
            <p className={styles.noDataMessage}>
              All cores have been renewed. Nothing left to renew!
            </p>
          )}
        </div>
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
