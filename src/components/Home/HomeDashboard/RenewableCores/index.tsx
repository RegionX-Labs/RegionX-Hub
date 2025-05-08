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

export default function RenewableCores() {
  const network = useUnit($network);
  const connections = useUnit($connections);
  const selectedAccount = useUnit($selectedAccount);
  const saleInfo = useUnit($latestSaleInfo);
  const potentialRenewals = useUnit($potentialRenewals);

  const [selected, setSelected] = useState<[RenewalKey, RenewalRecord] | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>('-');

  const options: SelectOption<[RenewalKey, RenewalRecord]>[] = Array.from(
    potentialRenewals.entries()
  )
    .filter(renewal => 
      renewal[0].when >= (saleInfo?.regionBegin || 0)
    )
    .map((renewal) => ({
      key: `${renewal[0].when}-${renewal[0].core}`,
      label: `Core ${renewal[0].core} | ${chainData[network]?.[(renewal[1].completion as any).value[0].assignment.value]?.name ?? 'Unknown'}`,
      value: renewal,
      icon: <img style={{width: 28, borderRadius: '100%', marginRight: '.5rem'}} src={chainData[network]?.[(renewal[1].completion as any).value[0].assignment.value]?.logo} />
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  useEffect(() => {
    potentialRenewalsRequested({ network, connections });
  }, [network, connections]);

  const getDateFromTimeslice = async (timeslice: number | null) => {
    setSelectedDeadline('-');
    if (!timeslice) return;
    const timestamp = await timesliceToTimestamp(timeslice, network, connections);
    if (!timestamp) return setSelectedDeadline('-');

    setSelectedDeadline(formatDate(timestamp));
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

    try {
      const tx = (client.getTypedApi(metadata.coretimeChain).tx as any).Broker.renew({
        core: selected[0].core,
      });
      const res = await tx.signAndSubmit(selectedAccount.polkadotSigner);
      if (res.ok) {
        toast.success('Transaction succeded!');
      } else {
        // TODO: provide more detailed error
        toast.error('Transaction failed');
      }
    } catch (e) {
      toast.error('Transaction cancelled');
      console.log(e);
    }
  };

  return (
    <div className={styles.renewableCoresCard}>
      <p className={styles.title}>Renewable Cores</p>

      <div className={styles.selectBox}>
        <Select
          options={options}
          selectedValue={selected}
          onChange={(val) => {
            setSelected(val);
            getDateFromTimeslice(val ? val[0].when : null);
          }}
        />
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

      <button className={styles.renewButton} onClick={renew}>
        Renew Now
      </button>
      <Toaster />
    </div>
  );
}
