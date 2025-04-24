import React, { useState, useEffect } from 'react';
import LabelCard from '../../LabelCard/LabelCard';
import styles from './RegionCardHeader.module.scss';
import Identicon from '@polkadot/react-identicon';
import { encodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import { Pencil } from 'lucide-react';

interface RegionCardHeaderProps {
  name: string; //Card Name
  regionStart: string; //start date
  regionEnd: string; //end date
  coreIndex: number;
  duration: string;
  onNameChange?: (newName: string) => void;
}

const RegionCardHeader: React.FC<RegionCardHeaderProps> = ({
  name,
  regionStart,
  regionEnd,
  coreIndex,
  duration,
  onNameChange,
}) => {
  const publicKey = blake2AsU8a(`${regionStart}-${regionEnd}-${coreIndex}`);
  const ss58Address = encodeAddress(publicKey, 42);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  useEffect(() => {
    setEditedName(name);
  }, [name]);

  const handleSave = () => {
    setIsEditing(false);
    if (onNameChange && editedName !== name) {
      onNameChange(editedName);
    }
  };

  return (
    <>
      <div className={styles['regionCardHeaderWrapper']}>
        <Identicon value={ss58Address} size={80} />
        <div className={styles['regionCardHeaderWrapper-data']}>
          <div className={styles['nameEditWrapper']}>
            {isEditing ? (
              <input
                className={styles['editInput']}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <h5>{name}</h5>
            )}
            <Pencil size={16} className={styles['editIcon']} onClick={() => setIsEditing(true)} />
          </div>
          <p>
            {regionStart} | {regionEnd}
          </p>
        </div>
      </div>
      <div className={styles['regionCardHeaderWrapper-labels']}>
        <LabelCard
          textColor='dark'
          variant='primary'
          color='gray5'
          label={`Core Index: ${coreIndex}`}
        />
        <LabelCard variant='primary' color='greenPrimary' label={duration} />
      </div>
    </>
  );
};

export default RegionCardHeader;
