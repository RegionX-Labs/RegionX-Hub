import { $regions, regionsRequested } from '@/coretime/regions';
import { useUnit } from 'effector-react';
import { $connections, $network } from '@/api/connection';
import { RegionCard } from '@region-x/components';
import { useEffect, useState } from 'react';
import styles from './my-regions.module.scss';
import { getNetworkChainIds } from '@/network';
import { dot } from '@polkadot-api/descriptors';

const MyRegionsPage = () => {
  const network = useUnit($network);
  const regions = useUnit($regions);
  const connections = useUnit($connections);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

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
    regionsRequested(network);
  }, [network]);

  useEffect(() => {
    console.log(connections);
  }, [regions, connections])


  const _timesliceToTimestamp = async (timeslice: number) => {
    // TODO
  }

  return (
    <>
      <div className={styles.container}>
        {regions.length > 0 ? (
          // TODO: filter expired regions(They should be filtered in the graphql request).
          regions.map((region) => (
            <div className={styles['region-card']} key={region.id}>
              {' '}
              <RegionCard
                selected={selectedRegionId == region.id}
                regionData={{
                  chainColor: 'greenDark',
                  chainLabel: 'Coretime Chain',
                  coreIndex: region.core,
                  consumed: 0,
                  // 57600 / 80 = 720
                  coreOcupaccy: ((countBits(region.mask) * 720) / 57600) * 100,
                  duration: '28 days', // TODO,
                  name: '', // TODO
                  regionEnd: `Timeslice: #${region.end}`, // TODO: Human readable format
                  regionStart:`Timeslice: #${region.begin}`, // TODO: Human readable format
                  currentUsage: 0, // TODO
                  onClick: () => setSelectedRegionId(region.id),
                }}
                task={`Unassigned`} // TODO
              />
            </div>
          ))
        ) : (
          <p>No regions available.</p>
        )}
      </div>
      <div>
        {' '}
        <nav className={styles.menu}>
          <ul>
            <li>
              <a href='#partition'>Partition</a>
            </li>
            <li>
              <a href='#interface'>Interface</a>
            </li>
            <li>
              <a href='#transfer'>Transfer</a>
            </li>
            <li>
              <a href='#assign'>Assign</a>
            </li>
            <li>
              <a href='#sell'>Sell</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MyRegionsPage;
