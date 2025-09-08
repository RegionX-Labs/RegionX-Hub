import React, { useState } from 'react';
import styles from './TransferToMarketplaceModal.module.scss';
import { useUnit } from 'effector-react';
import { $selectedAccount } from '@/wallet';
import { $accountData, MultiChainAccountData } from '@/account';
import { $connections, $network } from '@/api/connection';
import TransactionModal from '@/components/TransactionModal';
import toast, { Toaster } from 'react-hot-toast';
import { CORETIME_PARA_ID, RegionId, REGIONX_KUSAMA_PARA_ID } from '@/utils';
import Image from 'next/image';
import {
  PolkadotCoretime,
  KusamaCoretime,
  PaseoCoretime,
  WestendCoretime,
} from '@/assets/networks';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import {
  XcmV3Junction,
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedAssets,
  XcmVersionedLocation,
} from '@polkadot-api/descriptors';
import { AccountId, Binary } from 'polkadot-api';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';
import { X } from 'lucide-react';
import { u16, u32 } from 'scale-ts';
import { u8aToHex } from '@polkadot/util';
import { RegionLocation } from '@/coretime/regions';

interface Props {
  isOpen: boolean;
  regionId: RegionId;
  regionLocation: RegionLocation;
  onClose: () => void;
}

const encodeRegionId = (regionId: RegionId): bigint => {
  const encodedBegin = u8aToHex(Uint8Array.from(u32.enc(regionId.begin)).reverse()).substring(2);
  const encodedCore = u8aToHex(Uint8Array.from(u16.enc(regionId.core)).reverse()).substring(2);

  const hex = encodedBegin + encodedCore + regionId.mask.asHex().substring(2);
  return BigInt('0x' + hex);
};

const TransferToMarketplaceModal: React.FC<Props> = ({
  isOpen,
  regionId,
  regionLocation,
  onClose,
}) => {
  const accountData = useUnit($accountData);
  const selectedAccount = useUnit($selectedAccount);
  const network = useUnit($network);
  const connections = useUnit($connections);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const openModal = () => {
    if (!selectedAccount) {
      toast.error('Account not selected');
      return;
    }
    setIsModalOpen(true);
  };

  const onModalConfirm = async () => {
    if (regionLocation === RegionLocation.RegionxChain) {
      await transferToCoretimeChain();
    } else {
      await transferToRegionxChain();
    }
  };

  const transferToRegionxChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds) return toast.error('Unknown network');
    const connection = connections[networkChainIds.coretimeChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata) return toast.error('Connection or metadata missing');

    const tx = connection.client
      .getTypedApi(metadata.coretimeChain)
      .tx.PolkadotXcm.limited_reserve_transfer_assets({
        dest: XcmVersionedLocation.V3({
          parents: 1,
          interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(REGIONX_KUSAMA_PARA_ID)),
        }),
        beneficiary: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(selectedAccount.address)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V3([
          {
            // fee payment
            fun: XcmV3MultiassetFungibility.Fungible(BigInt(250000000)),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.Here(),
              parents: 1,
            }),
          },
          {
            fun: XcmV3MultiassetFungibility.NonFungible({
              type: 'Index',
              value: encodeRegionId(regionId),
            }),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.X1(XcmV3Junction.PalletInstance(50)),
              parents: 0,
            }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(
          <span>
            Transaction submitted:&nbsp;
            <a
              href={`${SUBSCAN_CORETIME_URL[network]}/extrinsic/${ev.txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: 'underline', color: '#60a5fa' }}
            >
              view transaction
            </a>
          </span>,
          { id: toastId }
        );
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else toast.success('Transaction succeeded!', { id: toastId });
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
    setIsModalOpen(false);
  };

  const transferToCoretimeChain = async () => {
    if (!selectedAccount) return toast.error('Account not selected');
    const networkChainIds = getNetworkChainIds(network);
    if (!networkChainIds || !networkChainIds.regionxChain) return toast.error('Unknown network');
    const connection = connections[networkChainIds.regionxChain];
    const metadata = getNetworkMetadata(network);
    if (!connection?.client || !metadata || !metadata.regionxChain)
      return toast.error('Connection or metadata missing');

    const tx = connection.client
      .getTypedApi(metadata.regionxChain)
      .tx.PolkadotXcm.limited_reserve_transfer_assets({
        dest: XcmVersionedLocation.V3({
          parents: 1,
          interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(CORETIME_PARA_ID)),
        }),
        beneficiary: XcmVersionedLocation.V3({
          parents: 0,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.AccountId32({
              network: undefined,
              id: Binary.fromBytes(AccountId().enc(selectedAccount.address)),
            })
          ),
        }),
        assets: XcmVersionedAssets.V3([
          {
            // fee payment
            fun: XcmV3MultiassetFungibility.Fungible(BigInt(25000000000)),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.Here(),
              parents: 1,
            }),
          },
          {
            fun: XcmV3MultiassetFungibility.NonFungible({
              type: 'Index',
              value: encodeRegionId(regionId),
            }),
            id: XcmV3MultiassetAssetId.Concrete({
              interior: XcmV3Junctions.X2([
                XcmV3Junction.Parachain(CORETIME_PARA_ID),
                XcmV3Junction.PalletInstance(50),
              ]),
              parents: 1,
            }),
          },
        ]),
        fee_asset_item: 0,
        weight_limit: XcmV3WeightLimit.Unlimited(),
      });

    const toastId = toast.loading('Transaction submitted');
    tx.signSubmitAndWatch(selectedAccount.polkadotSigner).subscribe(
      (ev) => {
        toast.loading(<span>Transaction submitted.</span>, { id: toastId });
        if (ev.type === 'finalized' || (ev.type === 'txBestBlocksState' && ev.found)) {
          if (!ev.ok) toast.error('Transaction failed', { id: toastId });
          else toast.success('Transaction succeeded!', { id: toastId });
        }
      },
      (e) => {
        toast.error('Transaction cancelled', { id: toastId });
        console.log(e);
      }
    );
    setIsModalOpen(false);
  };

  const getFormattedSource = () => {
    return `${network.charAt(0).toUpperCase() + network.slice(1)} Coretime`;
  };

  const getNetworkIcon = () => {
    switch (network) {
      case 'polkadot':
        return PolkadotCoretime.src;
      case 'kusama':
        return KusamaCoretime.src;
      case 'paseo':
        return PaseoCoretime.src;
      case 'westend':
        return WestendCoretime.src;
      default:
        return '/icons/default-network.svg';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            {regionLocation === RegionLocation.RegionxChain
              ? `Transfer to Coretime chain`
              : `Transfer to Marketplace Chain`}
          </h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <p className={styles.subText}>
          This action moves your region from the Coretime chain to the RegionX chain.
          <br />
          It will not be listed for sale automatically.
        </p>

        <div className={styles.visualRepresentation}>
          {regionLocation === RegionLocation.CoretimeChain ? (
            <>
              <div className={styles.chainBox}>
                <div className={styles.iconLabelWrapper}>
                  <Image src={getNetworkIcon()} alt='network icon' width={20} height={20} />
                  <span>{getFormattedSource()}</span>
                </div>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.chainBox}>
                <div className={styles.regionxLabelWrapper}>
                  <Image src='/favicon.ico' alt='RegionX icon' width={20} height={20} />
                  <span>RegionX</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.chainBox}>
                <div className={styles.regionxLabelWrapper}>
                  <Image src='/favicon.ico' alt='RegionX icon' width={20} height={20} />
                  <span>RegionX</span>
                </div>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.chainBox}>
                <div className={styles.iconLabelWrapper}>
                  <Image src={getNetworkIcon()} alt='network icon' width={20} height={20} />
                  <span>{getFormattedSource()}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {selectedAccount && accountData[selectedAccount.address] !== null && (
          <TransactionModal
            isOpen={isModalOpen}
            accountData={accountData[selectedAccount.address] as MultiChainAccountData}
            onClose={() => setIsModalOpen(false)}
            onConfirm={onModalConfirm}
          />
        )}

        <button className={styles.transferBtn} onClick={openModal}>
          Transfer now
        </button>

        <Toaster />
      </div>
    </div>
  );
};

export default TransferToMarketplaceModal;
