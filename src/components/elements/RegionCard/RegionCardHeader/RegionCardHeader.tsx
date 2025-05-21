import React, { useState, useEffect, useRef } from 'react';
import styles from './RegionCardHeader.module.scss';
import LabelCard from '../../LabelCard/LabelCard';
import Identicon from '@polkadot/react-identicon';
import { encodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import { Pencil, MoreHorizontal } from 'lucide-react';
import TransferModal from '../../../RegionModals/TransferModal';
import AssignModal from '../../../RegionModals/AssignModal';
import PartitionModal from '../../../RegionModals/PartitionModal';
import SellModal from '../../../RegionModals/SellModal';
import InterlaceModal from '../../../RegionModals/InterlaceModal';

interface RegionCardHeaderProps {
  name: string;
  regionStart: string;
  regionEnd: string;
  coreIndex: number;
  duration: string;
  onNameChange?: (newName: string) => void;
  regionStartTimeslice: number;
  regionEndTimeslice: number;
}

const RegionCardHeader: React.FC<RegionCardHeaderProps> = ({
  name,
  regionStart,
  regionEnd,
  coreIndex,
  duration,
  onNameChange,
  regionStartTimeslice,
  regionEndTimeslice,
}) => {
  const publicKey = blake2AsU8a(`${regionStart}-${regionEnd}-${coreIndex}`);
  const ss58Address = encodeAddress(publicKey, 42);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [isPartitionModalOpen, setPartitionModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const [isInterlaceModalOpen, setInterlaceModalOpen] = useState(false);

  const handleTransferClick = () => {
    setTransferModalOpen(true);
    setShowDropdown(false);
  };

  const handleAssignClick = () => {
    setAssignModalOpen(true);
    setShowDropdown(false);
  };

  useEffect(() => {
    setEditedName(name);
  }, [name]);

  const handleSave = () => {
    setIsEditing(false);
    if (onNameChange && editedName !== name) {
      onNameChange(editedName);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

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

        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <MoreHorizontal className={styles.dropdownIcon} onClick={toggleDropdown} />
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <div
                onClick={() => {
                  setPartitionModalOpen(true);
                  setShowDropdown(false);
                }}
              >
                Partition
              </div>
              <div
                onClick={() => {
                  setInterlaceModalOpen(true);
                  setShowDropdown(false);
                }}
              >
                Interlace
              </div>
              <div onClick={handleTransferClick}>Transfer</div>
              <div onClick={handleAssignClick}>Assign</div>
              <div
                onClick={() => {
                  setSellModalOpen(true);
                  setShowDropdown(false);
                }}
              >
                Sell
              </div>
            </div>
          )}
        </div>

        <TransferModal isOpen={isTransferModalOpen} onClose={() => setTransferModalOpen(false)} />
        <AssignModal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} />
        <PartitionModal
          isOpen={isPartitionModalOpen}
          onClose={() => setPartitionModalOpen(false)}
          regionBeginTimeslice={regionStartTimeslice}
          regionEndTimeslice={regionEndTimeslice}
          onSubmit={(percentage) => {
            console.log(`Partition at ${percentage}%`);
            setPartitionModalOpen(false);
          }}
        />

        <InterlaceModal
          isOpen={isInterlaceModalOpen}
          onClose={() => setInterlaceModalOpen(false)}
          onSubmit={(left, right) => {
            console.log(`Interlaced region ${coreIndex} — Left: ${left}% / Right: ${right}%`);
            setInterlaceModalOpen(false);
          }}
        />
        <SellModal
          isOpen={isSellModalOpen}
          onClose={() => setSellModalOpen(false)}
          onSubmit={(price, address) => {
            console.log(`Sell region ${coreIndex} for ${price} to ${address}`);
            setSellModalOpen(false);
          }}
        />
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
