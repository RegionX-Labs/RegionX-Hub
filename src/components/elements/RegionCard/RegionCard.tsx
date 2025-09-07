import React, { useEffect, useState, useMemo } from 'react';
import styles from './RegionCard.module.scss';
import RegionCardHeader from './RegionCardHeader/RegionCardHeader';
import RegionCardProperties from './RegionCardProperties/RegionCardProperties';
import LabelCard from '../LabelCard/LabelCard';
import Button from '../Button/Button';
import { RegionData } from '../../../types/type';
import { RegionId } from '@/utils';
import ModalPortal from '@/components/ModalPortal';
import RawRegionDataModal, { RawRegionPayload } from '@/components/RegionModals/RawRegionDataModal';

interface RegionCardProps {
  regionId: RegionId;
  typeMarketplace?: boolean;
  ownedRegion?: boolean;
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
  const [showRawModal, setShowRawModal] = useState(false);

  const durationTimeslices = useMemo(
    () =>
      typeof regionData.regionBeginTimeslice === 'number' &&
      typeof regionData.regionEndTimeslice === 'number'
        ? Math.max(0, regionData.regionEndTimeslice - regionData.regionBeginTimeslice)
        : undefined,
    [regionData.regionBeginTimeslice, regionData.regionEndTimeslice]
  );

  useEffect(() => {
    const storedName = localStorage.getItem(storageKey);
    if (storedName) setRegionName(storedName);
  }, [storageKey]);

  const handleNameChange = (newName: string) => {
    setRegionName(newName);
    localStorage.setItem(storageKey, newName);
  };

  const rawPayload: RawRegionPayload = useMemo(
    () => ({
      regionId,
      coreIndex: regionData.coreIndex,
      assignedTask: task,
      regionBeginTimeslice: regionData.regionBeginTimeslice,
      regionEndTimeslice: regionData.regionEndTimeslice,
      durationTimeslices,
      owner: regionData.owner ?? null,
      paidRaw: regionData.paid ?? null,
    }),
    [
      regionId,
      regionData.coreIndex,
      task,
      regionData.regionBeginTimeslice,
      regionData.regionEndTimeslice,
      durationTimeslices,
      regionData.owner,
      regionData.paid,
    ]
  );

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
        owner={regionData.owner}
        paid={regionData.paid}
        task={task}
        location={regionData.location}
        onToggleRaw={() => setShowRawModal(true)}
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

      {showRawModal && (
        <ModalPortal>
          <RawRegionDataModal
            isOpen={showRawModal}
            onClose={() => setShowRawModal(false)}
            payload={rawPayload}
          />
        </ModalPortal>
      )}
    </div>
  );
};

export default RegionCard;
