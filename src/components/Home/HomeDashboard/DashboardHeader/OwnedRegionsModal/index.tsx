'use client';

import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import { $regions } from '@/coretime/regions';
import { $latestSaleInfo, latestSaleRequested } from '@/coretime/saleInfo';
import { $connections, $network } from '@/api/connection';
import { $selectedAccount } from '@/wallet';
import { bitStringToUint8Array, maskToBin, timesliceToTimestamp } from '@/utils';
import { FixedSizeBinary } from 'polkadot-api';
import AssignModal from '@/components/RegionModals/AssignModal';
import styles from './OwnedRegionsModal.module.scss';

import Identicon from '@polkadot/react-identicon';
import { encodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import Select from '@/components/elements/Select';
import { SelectOption } from '@/types/type';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type RegionDateInfo = {
  beginDate: string;
  endDate: string;
  duration: string;
};

export default function OwnedRegionsModal({ isOpen, onClose }: Props) {
  const [selectedOption, setSelectedOption] = useState<SelectOption<string> | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [regionDateInfos, setRegionDateInfos] = useState<Record<string, RegionDateInfo>>();
  const [loading, setLoading] = useState(true);

  const [regions, network, connections, saleInfo, selectedAccount] = useUnit([
    $regions,
    $network,
    $connections,
    $latestSaleInfo,
    $selectedAccount,
  ]);

  useEffect(() => {
    latestSaleRequested(network);
  }, [network]);

  useEffect(() => {
    const loadDates = async () => {
      const updates: Record<string, RegionDateInfo> = {};
      for (const region of regions) {
        const beginTimestamp = await timesliceToTimestamp(region.begin, network, connections);
        const endTimestamp = await timesliceToTimestamp(region.end, network, connections);

        if (beginTimestamp && endTimestamp) {
          const beginDate = new Date(Number(beginTimestamp)).toLocaleDateString();
          const endDate = new Date(Number(endTimestamp)).toLocaleDateString();
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
  }, [regions]);

  if (!isOpen) return null;

  const selectOptions: SelectOption<SelectOption<string>>[] = regions
    .filter(
      (region) =>
        selectedAccount &&
        encodeAddress(region.owner, 42) === encodeAddress(selectedAccount.address, 42)
    )
    .map((region) => {
      const label = `Region #${region.core} (${region.begin} - ${region.end})`;
      const value: SelectOption<string> = {
        key: region.id,
        label,
        value: region.id,
      };
      const address = encodeAddress(
        blake2AsU8a(`${region.begin}-${region.end}-${region.core}`),
        42
      );
      return {
        key: region.id,
        label,
        value,
        icon: <Identicon value={address} size={24} style={{ borderRadius: '50%' }} />,
      };
    });

  const selectedRegion = regions.find((r) => r.id === selectedOption?.value);

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Select a Region to Assign</h2>

          <div className={styles.selectWrapper}>
            <Select
              options={selectOptions}
              selectedValue={selectedOption}
              onChange={setSelectedOption}
              variant='secondary'
              placeholder='Select a Region'
            />
          </div>

          {selectedRegion && (
            <div className={styles.preview}>
              <div className={styles.header}>
                <div className={styles.identiconWrapper}>
                  <Identicon
                    value={encodeAddress(
                      blake2AsU8a(
                        `${selectedRegion.begin}-${selectedRegion.end}-${selectedRegion.core}`
                      ),
                      42
                    )}
                    size={45}
                    className={styles.identicon}
                  />
                </div>
                <p className={styles.title}>Region #{selectedRegion.core}</p>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Start</span>
                <span className={styles.amount}>
                  {regionDateInfos?.[selectedRegion.id]?.beginDate ??
                    `Timeslice #${selectedRegion.begin}`}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>End</span>
                <span className={styles.amount}>
                  {regionDateInfos?.[selectedRegion.id]?.endDate ??
                    `Timeslice #${selectedRegion.end}`}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Duration</span>
                <span className={styles.amount}>
                  {regionDateInfos?.[selectedRegion.id]?.duration ?? '28 days'}
                </span>
              </div>

              <button
                className={styles.buyButton}
                onClick={() => {
                  setAssignOpen(true);
                }}
              >
                Assign
              </button>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.noBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {selectedRegion && assignOpen && (
        <AssignModal
          isOpen={assignOpen}
          regionId={{
            begin: selectedRegion.begin,
            core: selectedRegion.core,
            mask: new FixedSizeBinary(bitStringToUint8Array(maskToBin(selectedRegion.mask))),
          }}
          onClose={() => {
            setAssignOpen(false);
            setSelectedOption(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
