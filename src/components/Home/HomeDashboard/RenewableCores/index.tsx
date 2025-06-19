import { $connections, $network } from '@/api/connection';
import styles from './RenewableCores.module.scss';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import {
  $potentialRenewals,
  potentialRenewalsRequested,
  RenewalKey,
  RenewalRecord,
} from '@/coretime/renewals';
import { timesliceToTimestamp, toUnitFormatted } from '@/utils';
import { chainData } from '@/chaindata';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import toast, { Toaster } from 'react-hot-toast';
import { $latestSaleInfo } from '@/coretime/saleInfo';
import { $selectedAccount } from '@/wallet';
import { $accountData, MultiChainAccountData, getAccountData } from '@/account';
import TransactionModal from '@/components/TransactionModal';

type Props = {
  view: string;
};

export default function RenewableCores({ view }: Props) {
  const accountData = useUnit($accountData);
  const network = useUnit($network);
  const connections = useUnit($connections);
  const selectedAccount = useUnit($selectedAccount);
  const saleInfo = useUnit($latestSaleInfo);
  const potentialRenewals = useUnit($potentialRenewals);

  const [selected, setSelected] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>('-');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption<[RenewalKey, RenewalRecord]>[]>([]);

  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
  }, [network, connections]);

  useEffect(() => {
    if (!saleInfo) return;
    const _options: SelectOption<[RenewalKey, RenewalRecord]>[] = Array.from(
      potentialRenewals.entries()
    )
      .filter((renewal) => renewal[0].when === saleInfo.regionBegin)
      .map((renewal) => ({
        key: `${renewal[0].when}-${renewal[0].core}`,
        label: `Core ${renewal[0].core} | ${
          chainData[network]?.[(renewal[1].completion as any).value[0].assignment.value]?.name ??
          'Parachain ' + (renewal[1].completion as any).value[0].assignment.value
        }`,
        value: renewal,
        icon: (
          <img
            style={{ width: 28, borderRadius: '100%', marginRight: '8' }}
            src={
              chainData[network]?.[(renewal[1].completion as any).value[0].assignment.value]?.logo
            }
          />
        ),
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
    setOptions(_options);

    if (_options[0]) setSelected(_options[0].value);
  }, [saleInfo, potentialRenewals]);

  useEffect(() => {
    (async () => {
      if (!selected) return setSelectedDeadline('-');
      const deadline = await timesliceToTimestamp(selected[0].when, network, connections);
      if (!deadline) return setSelectedDeadline('-');
      setSelectedDeadline(formatDate(deadline));
    })();
  }, [selected]);

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    setIsModalOpen(true);
  };

  const formatDate = (timestamp: Date | bigint | null): string => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp));
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onModalConfirm = async () => {
    await renew();
    setIsModalOpen(false);
  };

  const renew = async () => {
    if (!selected) {
      toast.error('Core not selected');
      return;
    }
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    if (saleInfo?.coresSold == saleInfo?.coresOffered) {
      toast.error('No more cores remaining');
      return;
    }

    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) {
      toast.error('Unknown network');
      return;
    }
    const connection = connections[networkChainIds.coretimeChain];
    if (!connection || !connection.client || connection.status !== 'connected') {
      toast.error('Failed to connect to the API');
      return;
    }

    const client = connection.client;
    const metadata = getNetworkMetadata(network);
    if (!metadata) {
      toast.error('Failed to find metadata of the chains');
      return;
    }

    const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.renew({
      core: selected[0].core,
    });
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) {
            const err: any = ev.dispatchError;
            toast.error('Transaction failed');
            console.log(err);
          } else {
            toast.success('Transaction succeded!');
            getAccountData({ account: selectedAccount.address, connections, network });
          }
        }
      },
      (e) => {
        toast.error('Transaction cancelled');
        console.log(e);
      }
    );
  };

  return (
    <div
      className={`${styles.renewableCoresCard} ${
        view === 'Deploying a new project' ? styles.compact : ''
      }`}
    >
      <p className={styles.title}>Renewable Cores</p>

      <div className={styles.selectBox}>
        {options.length > 0 ? (
          <Select options={options} selectedValue={selected} onChange={setSelected} />
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

      {selectedAccount && accountData[selectedAccount.address] !== null && (
        <TransactionModal
          isOpen={isModalOpen}
          accountData={accountData[selectedAccount.address] as MultiChainAccountData}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onModalConfirm}
        />
      )}

      <button className={styles.renewButton} onClick={openModal}>
        Renew Now
      </button>
      <Toaster />
    </div>
  );
}
