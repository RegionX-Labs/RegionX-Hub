import React, { useEffect, useState } from 'react';
import styles from './RegionCard.module.scss';
import RegionCardHeader from './RegionCardHeader/RegionCardHeader';
import RegionCardProperties from './RegionCardProperties/RegionCardProperties';
import LabelCard from '../LabelCard/LabelCard';
import Button from '../Button/Button';
import { RegionData } from '../../../types/type';
import { RegionId } from '@/utils';

interface RegionCardProps {
  regionId: RegionId;
  typeMarketplace?: boolean; // Is the region listed on a marketplace
  ownedRegion?: boolean; // Is the region owned by the user (determines whether to show 'purchase' or 'unlist')
  selected?: boolean;
  regionData: RegionData;
  task: string;
}

const RegionCard: React.FC<RegionCardProps> = ({
  regionId,
  task,
  typeMarketplace,
  ownedRegion,
  selected,
  regionData,
}) => {
  const storageKey = `regionName-${regionData.regionStart}-${regionData.regionEnd}-${regionData.coreIndex}`;

  const [regionName, setRegionName] = useState(regionData.name);

  useEffect(() => {
    const storedName = localStorage.getItem(storageKey);
    if (storedName) {
      setRegionName(storedName);
    }
  }, [storageKey]);

  const handleNameChange = (newName: string) => {
    setRegionName(newName);
    localStorage.setItem(storageKey, newName);
  };

  return (
    <div
      className={`${styles.regionCardWrapper} ${selected ? styles.selected : ''}`}
      onClick={regionData.onClick}
    >
      <RegionCardHeader
        name={regionName}
        regionId={regionId}
        regionStart={regionData.regionStart}
        regionEnd={regionData.regionEnd}
        regionStartTimeslice={regionData.regionBeginTimeslice}
        regionEndTimeslice={regionData.regionEndTimeslice}
        coreIndex={regionData.coreIndex}
        duration={regionData.duration}
        onNameChange={handleNameChange}
      />

      <RegionCardProperties
        task={task}
        typeMarketplace={typeMarketplace}
        coreOcupaccy={regionData.coreOcupaccy}
        consumed={regionData.consumed}
        currentUsage={regionData.currentUsage}
      />

      {!typeMarketplace && regionData.chainLabel && regionData.chainColor ? (
        <div className={styles['regionCardWrapper-labels']}>
          <LabelCard label='Renewable' color='yellowDark' variant='primary' />
          <LabelCard
            label={regionData.chainLabel}
            color={regionData.chainColor}
            variant='primary'
          />
        </div>
      ) : (
        <Button onClick={!ownedRegion ? regionData.onUnlist : regionData.onPurchase} color='gray3'>
          {!ownedRegion ? 'Unlist' : 'Purchase'}
        </Button>
      )}
    </div>
  );
};

export default RegionCard;
