'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './RegionCardHeader.module.scss';
import LabelCard from '../../LabelCard/LabelCard';
import Identicon from '@polkadot/react-identicon';
import { encodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import TransferModal from '../../../RegionModals/TransferModal';
import AssignModal from '../../../RegionModals/AssignModal';
import PartitionModal from '../../../RegionModals/PartitionModal';
import SellModal from '../../../RegionModals/SellModal';
import InterlaceModal from '../../../RegionModals/InterlaceModal';
import TransferToMarketplaceModal from '../../../RegionModals/TransferToMarketplaceModal';
import ModalPortal from '@/components/ModalPortal';

import { RegionId, toUnitFormatted } from '@/utils';
import { useUnit } from 'effector-react';
import { $network } from '@/api/connection';

interface RegionCardHeaderProps {
  name: string;
  regionId: RegionId;
  regionStart: string;
  regionEnd: string;
  coreIndex: number;
  duration: string;
  onNameChange?: (newName: string) => void;
  regionStartTimeslice: number;
  regionEndTimeslice: number;
  task: string;
  owner?: string;
  paid?: string | bigint;
}

const RegionCardHeader: React.FC<RegionCardHeaderProps> = ({
  name,
  regionId,
  regionStart,
  regionEnd,
  coreIndex,
  duration,
  onNameChange,
  regionStartTimeslice,
  regionEndTimeslice,
  owner,
  paid,
  task,
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
  const [isMarketplaceModalOpen, setMarketplaceModalOpen] = useState(false);

  const network = useUnit($network);
  const isKusama = network === 'kusama';
  const paidFormatted =
    typeof paid !== 'undefined' && BigInt(paid.toString()) > BigInt(0)
      ? toUnitFormatted(network, BigInt(paid.toString()))
      : '-';

  const [copied, setCopied] = useState(false);

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
    const next = editedName.trim();
    setIsEditing(false);
    if (!next || next === name) {
      setEditedName(name);
      return;
    }
    onNameChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditedName(name);
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

  function truncateMiddle(address: string, maxStart = 8, endLength = 3): string {
    if (address.length <= maxStart + endLength + 3) return address;
    const start = address.slice(0, maxStart);
    const end = address.slice(-endLength);
    return `${start}...${end}`;
  }

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
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <h5>{name}</h5>
            )}
            <Image
              src='/rename.png'
              alt='rename'
              width={16}
              height={16}
              className={styles.rename}
              onClick={() => setIsEditing(true)}
            />
          </div>
          <p>
            {regionStart} | {regionEnd}
          </p>
        </div>

        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <MoreHorizontal className={styles.dropdownIcon} onClick={toggleDropdown} />
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <div onClick={() => setPartitionModalOpen(true)}>Partition</div>
              <div onClick={() => setInterlaceModalOpen(true)}>Interlace</div>
              <div onClick={handleTransferClick}>Transfer</div>
              <div onClick={handleAssignClick}>Assign</div>
              <div onClick={() => setSellModalOpen(true)}>Sell</div>
              {isKusama && (
                <div onClick={() => setMarketplaceModalOpen(true)}>Transfer to RegionX</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.labelsRow}>
        <div className={styles.labelWithIcon}>
          <img src='/barcode.png' alt='core index' />
          <span>Core Index: {coreIndex}</span>
        </div>
        <div className={styles.labelWithIcon}>
          <img src='/paid.png' alt='paid' />
          <span>Paid: {paidFormatted}</span>
        </div>
        <div className={styles.labelWithIcon}>
          <span>Assigned: {task}</span>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.labelWithIcon}>
            <img src='/timer.png' alt='duration' />
            <span>{duration}</span>
          </div>

          {owner && (
            <div className={styles.ownerWrapper} title={owner}>
              <Identicon
                value={owner}
                size={16}
                theme='polkadot'
                className={styles.ownerIdenticon}
              />
              <span
                className={styles.ownerAddressWrapper}
                onClick={() => {
                  navigator.clipboard.writeText(owner);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
              >
                <span className={styles.ownerAddress} title={owner}>
                  {truncateMiddle(owner)}
                </span>
                {copied && <span className={styles.copiedTooltip}>Copied!</span>}
              </span>
            </div>
          )}
        </div>
      </div>

      {isTransferModalOpen && (
        <ModalPortal>
          <TransferModal
            isOpen={isTransferModalOpen}
            onClose={() => setTransferModalOpen(false)}
            regionId={regionId}
          />
        </ModalPortal>
      )}

      {isAssignModalOpen && (
        <ModalPortal>
          <AssignModal
            isOpen={isAssignModalOpen}
            onClose={() => setAssignModalOpen(false)}
            regionId={regionId}
          />
        </ModalPortal>
      )}

      {isPartitionModalOpen && (
        <ModalPortal>
          <PartitionModal
            isOpen={isPartitionModalOpen}
            onClose={() => setPartitionModalOpen(false)}
            regionId={regionId}
            regionBeginTimeslice={regionStartTimeslice}
            regionEndTimeslice={regionEndTimeslice}
          />
        </ModalPortal>
      )}

      {isInterlaceModalOpen && (
        <ModalPortal>
          <InterlaceModal
            isOpen={isInterlaceModalOpen}
            onClose={() => setInterlaceModalOpen(false)}
            regionId={regionId}
          />
        </ModalPortal>
      )}

      {isSellModalOpen && (
        <ModalPortal>
          <SellModal isOpen={isSellModalOpen} onClose={() => setSellModalOpen(false)} />
        </ModalPortal>
      )}

      {isMarketplaceModalOpen && (
        <ModalPortal>
          <TransferToMarketplaceModal
            isOpen={isMarketplaceModalOpen}
            onClose={() => setMarketplaceModalOpen(false)}
            regionId={regionId}
          />
        </ModalPortal>
      )}
    </>
  );
};

export default RegionCardHeader;
