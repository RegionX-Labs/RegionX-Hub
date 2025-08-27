'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useUnit } from 'effector-react';
import styles from './sale-history.module.scss';
import { TableComponent } from '../../../components/elements/TableComponent';
import SaleHistoryModal from '../../../components/SaleHistoryModal';
import {
  $saleHistory,
  saleHistoryRequested,
  type SaleInfo as Sale,
  fetchBrokerConfig,
} from '@/coretime/saleInfo';
import {
  $purchaseHistory,
  purchaseHistoryRequested,
  PurchaseHistoryItem,
} from '@/coretime/purchaseHistory';
import { $network, $connections } from '@/api/connection';
import {
  timesliceToTimestamp,
  blockToTimestamp,
  toUnitFormatted,
  RELAY_CHAIN_BLOCK_TIME,
  TIMESLICE_PERIOD,
  coretimeChainBlockTime,
  usesRelayChainBlocks,
} from '@/utils';
import { getNetworkChainIds, getNetworkMetadata } from '@/network';
import { Network } from '@/types';
import DutchAuctionChart from '../../../components/Home/HomeDashboard/DutchAuctionChart';

type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  searchKey?: string;
};

type Endpoints = { start: number; end: number };
type PhaseEndpoints = { interlude: Endpoints; leadin: Endpoints; fixed: Endpoints };

export const SUBSCAN_RELAY_URL: Record<string, string> = {
  polkadot: 'https://polkadot.subscan.io',
  kusama: 'https://kusama.subscan.io',
  paseo: 'https://paseo.subscan.io',
  westend: 'https://westend.subscan.io',
  none: '',
};

export const SUBSCAN_CORETIME_URL: Record<string, string> = {
  polkadot: 'https://coretime-polkadot.subscan.io',
  kusama: 'https://coretime-kusama.subscan.io',
  paseo: 'https://coretime-paseo.subscan.io',
  westend: 'https://coretime-westend.subscan.io',
  none: '',
};

const formatDate = (timestamp: Date | bigint | null): string => {
  if (!timestamp) return '-';
  const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp));
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const SaleHistoryPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [modalPurchases, setModalPurchases] = useState<Array<Record<string, TableData>>>([]);
  const [tableData, setTableData] = useState<Array<Record<string, TableData>>>([]);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [chartSale, setChartSale] = useState<Sale | null>(null);
  const [chartEndpoints, setChartEndpoints] = useState<PhaseEndpoints | null>(null);

  const network = useUnit($network);
  const saleInfo = useUnit($saleHistory);
  const connections = useUnit($connections);
  const purchaseHistory = useUnit($purchaseHistory);

  useEffect(() => {
    if (network) saleHistoryRequested(network);
  }, [network]);

  const computeEndpointsForSale = useCallback(
    async (sale: Sale): Promise<PhaseEndpoints | null> => {
      if (!network) return null;
      const chainIds = getNetworkChainIds(network);
      const metadata = getNetworkMetadata(network);
      if (!chainIds || !metadata) return null;
      const relayConn = connections[chainIds.relayChain];
      if (!relayConn) return null;

      const saleStartTimestamp = Number(
        await blockToTimestamp(sale.saleStart, relayConn, metadata.relayChain)
      );

      const config = await fetchBrokerConfig(network, connections);
      if (!config) return null;

      const regionDuration = sale.regionEnd - sale.regionBegin;
      const blockTime = usesRelayChainBlocks(network, sale)
        ? RELAY_CHAIN_BLOCK_TIME
        : coretimeChainBlockTime(network);

      const saleEndTimestamp =
        saleStartTimestamp -
        config.interlude_length * blockTime +
        regionDuration * TIMESLICE_PERIOD * RELAY_CHAIN_BLOCK_TIME;

      return {
        interlude: {
          start: saleStartTimestamp - config.interlude_length * blockTime,
          end: saleStartTimestamp,
        },
        leadin: {
          start: saleStartTimestamp,
          end: saleStartTimestamp + config.leadin_length * blockTime,
        },
        fixed: {
          start: saleStartTimestamp + config.leadin_length * blockTime,
          end: saleEndTimestamp,
        },
      };
    },
    [network, connections]
  );

  useEffect(() => {
    const processData = async () => {
      if (!network || !Array.isArray(saleInfo)) return;
      const processed = await Promise.all(
        saleInfo.map(async (sale: Sale) => {
          const regionBeginTimestamp = await timesliceToTimestamp(
            sale.regionBegin,
            network,
            connections
          );
          const regionEndTimestamp = await timesliceToTimestamp(
            sale.regionEnd,
            network,
            connections
          );

          const chainIds = getNetworkChainIds(network)!;
          const metadata = getNetworkMetadata(network)!;
          const relayConn = connections[chainIds.relayChain];
          const saleStartTimestamp = await blockToTimestamp(
            sale.saleStart,
            relayConn,
            metadata.relayChain
          );
          const saleEndTimestamp = sale.leadinLength
            ? await blockToTimestamp(
                sale.saleStart + sale.leadinLength,
                relayConn,
                metadata.relayChain
              )
            : null;

          const endpoints = await computeEndpointsForSale(sale);

          return {
            SaleID: {
              cellType: 'link' as const,
              data: String(sale.saleCycle),
              link: `/sales/${sale.saleCycle}`,
              searchKey: String(sale.saleCycle),
            },
            RegionBegin: {
              cellType: 'text' as const,
              data: formatDate(regionBeginTimestamp),
              searchKey: formatDate(regionBeginTimestamp),
            },
            RegionEnd: {
              cellType: 'text' as const,
              data: formatDate(regionEndTimestamp),
              searchKey: formatDate(regionEndTimestamp),
            },
            SaleStart: {
              cellType: 'text' as const,
              data: formatDate(saleStartTimestamp),
              searchKey: formatDate(saleStartTimestamp),
            },
            SaleEnd: {
              cellType: 'text' as const,
              data: formatDate(saleEndTimestamp),
              searchKey: formatDate(saleEndTimestamp),
            },
            Auction: {
              cellType: 'jsx' as const,
              data: (
                <button
                  className={styles.auctionCell}
                  onClick={(e) => {
                    e.stopPropagation();
                    setChartSale(sale);
                    setChartEndpoints(endpoints);
                    setChartModalOpen(true);
                  }}
                  title='Open Dutch auction'
                >
                  <DutchAuctionChart
                    theme='dark'
                    mode='mini'
                    height={12}
                    sale={sale}
                    endpoints={endpoints ?? null}
                  />
                </button>
              ),
              searchKey: String(sale.saleCycle),
            },
          };
        })
      );
      setTableData(processed);
    };
    processData();
  }, [saleInfo, network, connections, computeEndpointsForSale]);

  const handleSaleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/sales/')) {
        e.preventDefault();
        const saleId = target.getAttribute('href')?.split('/sales/')[1];
        if (saleId && network) {
          const id = parseInt(saleId, 10);
          setSelectedSaleId(id);
          setModalOpen(true);
          purchaseHistoryRequested({ network, saleCycle: id });
        }
      }
    },
    [network]
  );

  useEffect(() => {
    if (!network) return;
    const baseUrl = SUBSCAN_CORETIME_URL[network] || 'https://subscan.io';
    const formatted = purchaseHistory.map((p: PurchaseHistoryItem) => ({
      ExtrinsicID: {
        cellType: 'jsx' as const,
        data: (
          <a
            href={`${baseUrl}/extrinsic/${p.extrinsicId}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {p.extrinsicId}
          </a>
        ),
        searchKey: p.extrinsicId,
      },
      Account: { cellType: 'address' as const, data: p.address, searchKey: p.address },
      CoreID: { cellType: 'text' as const, data: String(p.core), searchKey: String(p.core) },
      Price: {
        cellType: 'text' as const,
        data: toUnitFormatted(network, BigInt(p.price)),
        searchKey: String(p.price),
      },
      SalesType: { cellType: 'text' as const, data: p.type, searchKey: p.type },
      Timestamp: {
        cellType: 'text' as const,
        data: formatDate(p.timestamp),
        searchKey: formatDate(p.timestamp),
      },
    }));
    setModalPurchases(formatted);
  }, [purchaseHistory, network]);

  return (
    <div className={styles.sale_history_table}>
      <h2 className={styles.heading}>Historical sales</h2>
      <p className={styles.subheading}>Shows the full sale history</p>

      <div className={styles.tableWrapper} onClick={handleSaleClick}>
        <TableComponent data={tableData} pageSize={8} />
      </div>

      {modalOpen &&
        selectedSaleId !== null &&
        (() => {
          const sale = saleInfo.find((s) => s.saleCycle === selectedSaleId);
          if (!sale) return null;
          return (
            <SaleHistoryModal
              open={modalOpen}
              saleId={selectedSaleId}
              sale={sale}
              purchases={modalPurchases}
              onClose={() => setModalOpen(false)}
            />
          );
        })()}

      {chartModalOpen && chartSale && chartEndpoints && (
        <div className={styles.modalOverlay} onClick={() => setChartModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Dutch auction</div>
              <button className={styles.closeBtn} onClick={() => setChartModalOpen(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <DutchAuctionChart
                theme='dark'
                mode='full'
                context='modal'
                sale={chartSale}
                endpoints={chartEndpoints}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleHistoryPage;
