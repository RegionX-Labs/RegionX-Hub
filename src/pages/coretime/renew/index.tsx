import { Select, Button } from '@region-x/components';
import { useState, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { $connections, $network } from '@/api/connection';
import { toUnitFormatted } from '../../../utils/index';
import { timesliceToTimestamp } from '@/utils';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import styles from './renew.module.scss';

interface Renewal {
  core?: number;
  when: number;
  assignmentValue?: number;
  price?: bigint;
}

TimeAgo.addLocale(en);

export const getRelativeTime = (timestamp: number | Date): string => {
  const timeAgo = new TimeAgo('en-US');
  return timeAgo.format(timestamp, {
    steps: [
      { formatAs: 'second' },
      { formatAs: 'minute', minTime: 60 },
      { formatAs: 'hour', minTime: 60 * 60 },
      { formatAs: 'day', minTime: 24 * 60 * 60 },
    ],
    labels: 'long',
  });
};

const formatDuration = (milliseconds: bigint): string => {
  const totalSeconds = Number(milliseconds) / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;

  const weeks = Math.floor(totalDays / 7);
  const days = Math.floor(totalDays % 7);
  const hours = Math.floor(totalHours % 24);

  const parts = [];
  if (weeks > 0) {
    parts.push(`${weeks} week${weeks !== 1 ? 's' : ''}`);
  }
  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }
  if (hours > 0 || parts.length === 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }

  return parts.join(' ') || 'less than an hour';
};

const RenewPage = () => {
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [selectedRenewal, setSelectedRenewal] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<Record<number, string>>({});

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

        const parsedRenewals = potentialRenewalsRaw.map((entry: any) => {
          const core = entry.keyArgs?.[0]?.core;
          const when = entry.keyArgs?.[0]?.when;

          const completionValue = entry.value?.completion?.value?.[0];
          const assignmentValue = completionValue?.assignment?.value;
          const price = entry.value?.price;

          return {
            core,
            when,
            assignmentValue,
            price,
          } as Renewal;
        });

        setRenewals(parsedRenewals);

        const timeRemainingMap: Record<number, string> = {};
        for (const renewal of parsedRenewals) {
          if (renewal.core !== undefined) {
            const timestamp = await timesliceToTimestamp(renewal.when, network, connections);
            if (timestamp) {
              const now = Date.now();
              const remainingMs = Number(timestamp) - now;
              timeRemainingMap[renewal.core] =
                remainingMs > 0 ? formatDuration(BigInt(remainingMs)) : 'expired';
            } else {
              timeRemainingMap[renewal.core] = 'unknown';
            }
          }
        }
        setTimeRemaining(timeRemainingMap);

        if (parsedRenewals.length > 0 && parsedRenewals[0].core !== undefined) {
          setSelectedRenewal(
            `${parsedRenewals[0].core}-${parsedRenewals[0].assignmentValue ?? 'N/A'}`
          );
        } else {
          setSelectedRenewal('');
        }
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

  const options = renewals
    .filter((renewal) => renewal.core !== undefined)
    .map((renewal) => ({
      value: `${renewal.core}-${renewal.assignmentValue ?? 'N/A'}`,
      label: `Core ${renewal.core} | #${renewal.assignmentValue ?? 'N/A'}`,
    }));

  const selectedCore = selectedRenewal.split('-')[0];
  const renewal = renewals.find((r) => String(r.core) === selectedCore);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.selectWrapper}>
          {options.length > 0 && (
            <Select<string>
              options={options}
              selectedValue={selectedRenewal}
              onChange={handleSelectChange}
              placeholder='Select a core to renew'
            />
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span>Core number:</span>
            <span>{renewal?.core ?? 'N/A'}</span>
          </div>
          <div className={styles.detailRow}>
            <span>Time remaining:</span>
            <span>
              {renewal?.core !== undefined
                ? (timeRemaining[renewal.core] ?? 'calculating...')
                : 'N/A'}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span>Renewal price:</span>
            <span>
              {renewal?.price !== undefined ? toUnitFormatted(network, renewal.price) : 'N/A'}
            </span>
          </div>
        </div>

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
