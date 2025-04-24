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
      <p className={styles['RegionCardProperties-headline']}>Task: {task}</p>
      <div className={styles['RegionCardProperties-slider']}>
        <Slider initialValue={coreOcupaccy} max={100} min={0} disabled />
        <p>
          <b>{coreOcupaccy}%</b> Core ocupaccy
        </p>
      </div>
      <div className={styles['RegionCardProperties-slider']}>
        <Slider initialValue={consumed} max={100} min={0} disabled />
        <p>
          <b>{consumed}%</b> Consumed
        </p>
      </div>
      {!typeMarketplace ? (
        <div className={styles['RegionCardProperties-slider']}>
          <Slider initialValue={currentUsage} max={100} min={0} disabled />
          <p>
            <b>{currentUsage}%</b> Current usage
          </p>
        </div>
      ) : null}
      <span className={styles['disancer']}></span>
    </>
  );
};

export default RegionCardProperties;
