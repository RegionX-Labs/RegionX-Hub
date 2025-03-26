import { Select, Button } from '@region-x/components';
import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import styles from './renew.module.scss';

interface Renewal {
  core?: number;
  paraId?: number;
  when: number;
  assignmentValue?: number;
  completion: {
    type: 'Complete';
    Complete: Array<{
      mask: string;
      assignment?: {
        value: number;
      };
    }>;
  };
}

const RenewPage = () => {
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [selectedRenewal, setSelectedRenewal] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const network = useUnit($network);
  const connections = useUnit($connections);

  useEffect(() => {
    const fetchRenewals = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const networkChainIds = getNetworkChainIds(network);
        if (!networkChainIds) {
          throw new Error('Network chain IDs not found');
        }

        const connection = connections[networkChainIds.coretimeChain];
        if (!connection || !connection.client || connection.status !== 'connected') {
          return;
        }

        const client = connection.client;
        const metadata = getNetworkMetadata(network);
        if (!metadata) {
          return;
        }

        const potentialRenewalsRaw = await (
          client.getTypedApi(metadata.coretimeChain) as any
        ).query.Broker.PotentialRenewals.getEntries();

        console.log('Raw Potential Renewals:', potentialRenewalsRaw);

        const parsedRenewals = potentialRenewalsRaw.map((entry: any) => {
          const core = entry.keyArgs?.[0]?.core;
          const assignmentValue = entry.value?.completion?.value?.[0]?.assignment?.value;

          return {
            core,
            assignmentValue,
          } as Renewal;
        });

        console.log('Parsed Renewals:', parsedRenewals);

        setRenewals(parsedRenewals);
      } catch (err) {
        console.error('Failed to fetch renewals:', err);
        setError('Failed to load renewal data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRenewals();
  }, [network, connections]);

  const handleSelectChange = (value: string | null) => {
    setSelectedRenewal(value ?? '');
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const options = [
    { value: 'none', label: 'No need to renew in the current sale' },
    ...renewals
      .filter((renewal) => renewal.core !== undefined)
      .map((renewal) => ({
        value: `${renewal.core}-${renewal.assignmentValue ?? 'N/A'}`,
        label: `Core ${renewal.core} | #${renewal.assignmentValue ?? 'N/A'}`,
      })),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.selectWrapper}>
          <Select<string>
            options={options}
            selectedValue={selectedRenewal}
            onChange={handleSelectChange}
            placeholder='Select a core to renew'
          />
        </div>

        {selectedRenewal && selectedRenewal !== 'none' && (
          <div className={styles.details}>
            {renewals
              .filter(
                (renewal) => renewal.core !== undefined && String(renewal.core) === selectedRenewal
              )
              .map((renewal) => (
                <div key={renewal.core} className={styles.detailRow}>
                  <span>Core number:</span>
                  <span>{renewal.core}</span>
                </div>
              ))}
          </div>
        )}

        <div className={styles.buttonRow}>
          <div className={styles.buttonWrapper}>
            <Button disabled={!selectedRenewal || selectedRenewal === 'none'}>Renew</Button>
          </div>
          <div className={styles.coretimeText}>
            Polkadot Coretime: <span className={styles.amount}>0 DOT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewPage;
