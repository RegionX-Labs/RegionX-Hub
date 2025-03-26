import { Select, Button } from '@region-x/components';
import styles from './renew.module.scss';
import { useEffect, useState } from 'react';
import { $network } from '@/api/connection';
import { useUnit } from 'effector-react';

interface Completion {
  Complete: {
    mask: string;
    assignment: {
      Task: number;
    };
  }[];
}

interface PotentialRenewal {
  core: number;
  when: number;
  price: bigint;
  completion: Completion;
}

declare const Broker: {
  PotentialRenewals: {
    getEntries: () => Promise<PotentialRenewal[]>;
  };
};

const RenewPage = () => {
  const network = useUnit($network);
  const [potentialRenewals, setPotentialRenewals] = useState<PotentialRenewal[]>([]);
  const [selectedRenewal, setSelectedRenewal] = useState<PotentialRenewal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPotentialRenewals = async () => {
      try {
        setLoading(true);
        const renewals = await Broker.PotentialRenewals.getEntries();

        const filteredRenewals = renewals.filter((renewal: PotentialRenewal) =>
          renewal.completion.Complete.some(
            (complete: { mask: string }) => complete.mask === '0xffffffffffffffffffff'
          )
        );

        setPotentialRenewals(filteredRenewals);

        if (filteredRenewals.length === 1) {
          setSelectedRenewal(filteredRenewals[0]);
        }
      } catch (err) {
        console.error('Error fetching potential renewals:', err);
        setError('Failed to fetch potential renewals');
      } finally {
        setLoading(false);
      }
    };

    fetchPotentialRenewals();
  }, [network]);

  const handleRenewalSelect = (value: string | null) => {
    if (value === null) {
      setSelectedRenewal(null);
    } else {
      const selected = potentialRenewals.find(
        (renewal) => renewal.completion.Complete[0].assignment.Task.toString() === value
      );
      setSelectedRenewal(selected || null);
    }
  };

  const formatPrice = (price: bigint) => {
    const dotAmount = Number(price) / 10_000_000_000;
    return dotAmount.toFixed(3) + ' DOT';
  };

  const formatExpiry = (when: number) => {
    return `Timeslice #${when}`;
  };

  if (loading) {
    return <div className={styles.container}>Loading potential renewals...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.selectWrapper}>
          <Select
            options={[
              ...potentialRenewals.map((renewal) => ({
                value: renewal.completion.Complete[0].assignment.Task.toString(),
                label: `Task #${renewal.completion.Complete[0].assignment.Task} | Core ${renewal.core}`,
              })),
              { value: null, label: 'No need to renew in the current sale' },
            ]}
            onChange={handleRenewalSelect}
            selectedValue={
              selectedRenewal?.completion.Complete[0].assignment.Task.toString() || null
            }
          />
        </div>

        {selectedRenewal ? (
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span>Core number:</span>
              <span>{selectedRenewal.core}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Expiry in:</span>
              <span>{formatExpiry(selectedRenewal.when)}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Renewal price:</span>
              <span>{formatPrice(selectedRenewal.price)}</span>
            </div>
          </div>
        ) : (
          <div className={styles.details}>
            <p>No renewal selected or needed.</p>
          </div>
        )}

        <div className={styles.buttonRow}>
          <div className={styles.buttonWrapper}>
            <Button disabled={!selectedRenewal}>Renew</Button>
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
