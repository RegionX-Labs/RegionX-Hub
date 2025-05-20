import { $regions, regionsRequested } from '@/coretime/regions';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { RegionCard } from '../../../components/elements/RegionCard';
import { useEffect, useState } from 'react';
import styles from './my-regions.module.scss';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { timesliceToTimestamp } from '@/utils';
import { $selectedAccount } from '@/wallet';
import { encodeAddress } from '@polkadot/util-crypto';

type RegionDateInfo = {
  beginDate: string;
  endDate: string;
  duration: string;
};

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

const MyRegionsPage = () => {
  const network = useUnit($network);
  const regions = useUnit($regions);
  const saleInfo = useUnit($latestSaleInfo);
  const connections = useUnit($connections);
  const selectedAccount = useUnit($selectedAccount);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [regionDateInfos, setRegionDateInfos] = useState<Record<string, RegionDateInfo>>();
  const [loading, setLoading] = useState(true);

  const countBits = (regionMask: string) => {
    let count = 0;
    // Convert hex to bits and count ones.
    for (let i = 2; i < regionMask.length; ++i) {
      let v = parseInt(regionMask.slice(i, i + 1), 16);
      while (v > 0) {
        if (v & 1) ++count;
        v >>= 1;
      }
    }
    return count;
  };

  useEffect(() => {
    if (!saleInfo) return;
    const regionDuration = saleInfo.regionEnd - saleInfo.regionBegin;
    const afterTimeslice = saleInfo.regionBegin - regionDuration;
    regionsRequested({ network, afterTimeslice });
  }, [network, saleInfo]);

  useEffect(() => {
    latestSaleRequested(network);
  }, [connections, network]);

  useEffect(() => {
    const loadDates = async () => {
      const updates: Record<string, RegionDateInfo> = {};
      for (const region of regions) {
        const beginTimestamp = await timesliceToTimestamp(region.begin, network, connections);
        const endTimestamp = await timesliceToTimestamp(region.end, network, connections);

        if (beginTimestamp && endTimestamp) {
          const beginDate = getRelativeTime(Number(beginTimestamp.toString()));
          const endDate = getRelativeTime(Number(endTimestamp.toString()));

          const durationMs = Number(endTimestamp) - Number(beginTimestamp);
          const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24));

          updates[region.id] = {
            beginDate,
            endDate,
            duration: `${durationDays} day${durationDays === 1 ? '' : 's'}`,
          };
        }
      }
      setRegionDateInfos(updates);
      setLoading(false);
    };

    if (regions.length > 0) {
      loadDates();
    } else {
      setLoading(false);
    }
  }, [regions, network, connections]);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.pageHeader}>
          {selectedAccount && <h1>My Regions</h1>}

          {!loading &&
          selectedAccount &&
          regions.length > 0 &&
          !regions.some(
            (r) => encodeAddress(r.owner, 42) === encodeAddress(selectedAccount.address, 42)
          ) ? (
            <p className={styles.noRegionsMessage}>No regions owned by the selected account.</p>
          ) : (
            <p className={styles.subtitle}></p>
          )}
          <p className={styles.subtitle}>All regions</p>
        </div>

        <div className={styles.container}>
          {regions.map((region) => {
            const regionStart = regionDateInfos?.[region.id]?.beginDate
              ? `Begin: ${regionDateInfos[region.id].beginDate}`
              : `Begin: Timeslice #${region.begin}`;

            const regionEnd = regionDateInfos?.[region.id]?.endDate
              ? `End: ${regionDateInfos[region.id].endDate}`
              : `End: Timeslice #${region.end}`;

            const storageKey = `regionName-${regionStart}-${regionEnd}-${region.core}`;
            const storedName =
              typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

            return (
              <div className={styles['region-card']} key={region.id}>
                <RegionCard
                  selected={selectedRegionId == region.id}
                  regionData={{
                    chainColor: 'greenDark',
                    chainLabel: 'Coretime Chain',
                    coreIndex: region.core,
                    consumed: 0,
                    // 57600 / 80 = 720
                    coreOcupaccy: ((countBits(region.mask) * 720) / 57600) * 100,
                    duration: regionDateInfos?.[region.id]?.duration || '28 days',
                    name: storedName || `Region #${region.core}`,
                    regionEnd,
                    regionStart,
                    currentUsage: 0, // TODO
                    onClick: () => setSelectedRegionId(region.id),
                  }}
                  task={`Unassigned`} // TODO
                />
              </div>
            );
          })}

          {!loading &&
            selectedAccount &&
            regions.length > 0 &&
            !regions.some((r) => r.owner === selectedAccount.address) && <></>}
        </div>
      </div>
    </>
  );
};

export default MyRegionsPage;
