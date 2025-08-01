import { $regions, Region } from '@/coretime/regions';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { RegionCard } from '../../../components/elements/RegionCard';
import { useEffect, useMemo, useState } from 'react';
import styles from './my-regions.module.scss';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { bitStringToUint8Array, maskToBin, RegionId, timesliceToTimestamp } from '@/utils';
import { $selectedAccount } from '@/wallet';
import { encodeAddress } from '@polkadot/util-crypto';
import { FixedSizeBinary } from 'polkadot-api';

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
  const connections = useUnit($connections);
  const selectedAccount = useUnit($selectedAccount);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [regionDateInfos, setRegionDateInfos] = useState<Record<string, RegionDateInfo>>();
  const [loading, setLoading] = useState(true);

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

  const ownedRegions = useMemo(() => {
    if (!selectedAccount) return false;
    return regions.filter(
      (region) => encodeAddress(region.owner, 42) === encodeAddress(selectedAccount.address, 42)
    );
  }, [regions, selectedAccount]);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.pageHeader}>
          {selectedAccount && <h1>My Regions</h1>}

          {!loading && !ownedRegions && (
            <div className={styles.messageNote}>No regions owned by the selected account. </div>
          )}

          {!loading && regions.length === 0 && (
            <div className={styles.messageNote}>There are no regions available.</div>
          )}
        </div>

        {ownedRegions && (
          <div className={styles.container}>
            <RegionsDisplay
              regionDateInfos={regionDateInfos ?? {}}
              regions={ownedRegions}
              selectedRegionId={selectedRegionId}
              setSelectedRegionId={setSelectedRegionId}
            />
          </div>
        )}
        <div className={styles.pageHeader}>
          {regions.length > 0 && <p className={styles.subtitle}>All regions</p>}
        </div>

        <div className={styles.container}>
          <RegionsDisplay
            regionDateInfos={regionDateInfos ?? {}}
            regions={regions}
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={setSelectedRegionId}
          />

          {!loading &&
            selectedAccount &&
            regions.length > 0 &&
            !regions.some((r) => r.owner === selectedAccount.address) && <></>}
        </div>
      </div>
    </>
  );
};

interface RegionsDisplayProps {
  regions: Region[];
  selectedRegionId: string | null;
  regionDateInfos: Record<string, RegionDateInfo>;
  setSelectedRegionId: (_id: string) => void;
}
const RegionsDisplay = ({
  regions,
  selectedRegionId,
  regionDateInfos,
  setSelectedRegionId,
}: RegionsDisplayProps) => {
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

  return regions.map((region) => {
    const regionStart = regionDateInfos?.[region.id]?.beginDate
      ? `Begin: ${regionDateInfos[region.id].beginDate}`
      : `Begin: Timeslice #${region.begin}`;

    const regionEnd = regionDateInfos?.[region.id]?.endDate
      ? `End: ${regionDateInfos[region.id].endDate}`
      : `End: Timeslice #${region.end}`;

    const storageKey = `regionName-${regionStart}-${regionEnd}-${region.core}`;
    const storedName = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

    return (
      <div className={styles['region-card']} key={region.id}>
        <RegionCard
          selected={selectedRegionId == region.id}
          regionId={{
            begin: region.begin,
            core: region.core,
            mask: new FixedSizeBinary(bitStringToUint8Array(maskToBin(region.mask))),
          }}
          regionData={{
            chainColor: 'greenDark',
            chainLabel: 'Coretime Chain',
            coreIndex: region.core,
            consumed: 0,
            coreOcupaccy: ((countBits(region.mask) * 720) / 57600) * 100,
            duration: regionDateInfos?.[region.id]?.duration || '28 days',
            name: storedName || `Region #${region.core}`,
            regionStart,
            regionEnd,
            regionBeginTimeslice: region.begin,
            regionEndTimeslice: region.end,
            currentUsage: 0,
            onClick: () => setSelectedRegionId(region.id),
            owner: encodeAddress(region.owner, 42),
            paid: region.paid,
          }}
          task={`Unassigned`}
        />
      </div>
    );
  });
};

export default MyRegionsPage;
