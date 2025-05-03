import React from 'react';
import Slider from '../../Slider/Slider';
import styles from './RegionCardProperties.module.scss';

interface RegionCardPropertiesProps {
  task: string;
  coreOcupaccy: number;
  consumed: number;
  currentUsage?: number;
  typeMarketplace?: boolean;
}

const RegionCardProperties: React.FC<RegionCardPropertiesProps> = ({
  task,
  coreOcupaccy,
  consumed,
  currentUsage,
  typeMarketplace = false,
}) => {
  return (
    <>
      <span className={styles['disancer']}></span>
      <div className={styles['RegionCardProperties-slider']}>
        <div className={styles['RegionCardProperties-labelRow']}>
          <span>Core occupancy</span>
          <b>{coreOcupaccy}%</b>
        </div>
        <Slider initialValue={coreOcupaccy} max={100} min={0} disabled />
      </div>

      <div className={styles['RegionCardProperties-slider']}>
        <div className={styles['RegionCardProperties-labelRow']}>
          <span>Consumed</span>
          <b>{consumed}%</b>
        </div>
        <Slider initialValue={consumed} max={100} min={0} disabled />
      </div>

      {!typeMarketplace && (
        <div className={styles['RegionCardProperties-slider']}>
          <div className={styles['RegionCardProperties-labelRow']}>
            <span>Current usage</span>
            <b>{currentUsage}%</b>
          </div>
          <Slider initialValue={currentUsage} max={100} min={0} disabled />
        </div>
      )}

      <span className={styles['disancer']}></span>
    </>
  );
};

export default RegionCardProperties;
