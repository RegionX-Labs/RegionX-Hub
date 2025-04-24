import React, { useState, useEffect } from 'react';
import LabelCard from '../../LabelCard/LabelCard';
import styles from './RegionCardHeader.module.scss';
import Identicon from '@polkadot/react-identicon';
import { encodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import { Pencil, MoreVertical } from 'lucide-react';

interface RegionCardHeaderProps {
  name: string;
  regionStart: string;
  regionEnd: string;
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
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setEditedName(name);
  }, [name]);

  const handleSave = () => {
    setIsEditing(false);
    if (onNameChange && editedName !== name) {
      onNameChange(editedName);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <>
      <div className={styles.regionCardHeaderWrapper}>
        <Identicon value={ss58Address} size={80} className={styles.identicon} />
        <div className={styles['regionCardHeaderWrapper-data']}>
          <div className={styles.nameEditWrapper}>
            {isEditing ? (
              <input
                className={styles.editInput}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <h5>{name}</h5>
            )}
            <Pencil size={16} className={styles.editIcon} onClick={() => setIsEditing(true)} />
          </div>
          <p>
            {regionStart} | {regionEnd}
          </p>
        </div>
        <div className={styles.dropdownWrapper}>
          <MoreVertical className={styles.dropdownIcon} onClick={toggleDropdown} />
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <div>Partition</div>
              <div>Interface</div>
              <div>Transfer</div>
              <div>Assign</div>
              <div>Sell</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles['regionCardHeaderWrapper-labels']}>
        <div className={styles.labelWithIcon}>
          <img src='/barcode.png' alt='core index' />
          <span>Core Index: {coreIndex}</span>
        </div>
        <div className={styles.labelWithIcon}>
          <img src='/timer.png' alt='duration' />
          <span>{duration}</span>
        </div>
      </div>
    </>
  );
};

export default RegionCardHeader;
