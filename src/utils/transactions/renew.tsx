import { getAccountData } from '@/account';
import { Connection } from '@/api/connection';
import { ChainId, getNetworkChainIds, getNetworkMetadata } from '@/network';
import { SUBSCAN_CORETIME_URL } from '@/pages/coretime/sale-history';
import { Network } from '@/types';
import { WalletAccount } from '@/wallet';
import toast from 'react-hot-toast';

export const renew = async (
  network: Network,
  connections: Record<ChainId, Connection>,
  selectedAccount: WalletAccount,
  coreToRenew: number
) => {
  const networkChainIds = getNetworkChainIds(network);
  if (!networkChainIds) return toast.error('Unknown network');

  const connection = connections[networkChainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') {
    return toast.error('Failed to connect to the API');
  }

  const client = connection.client;
  const metadata = getNetworkMetadata(network);
  if (!metadata) return toast.error('Failed to find metadata of the chains');

  const tx = client.getTypedApi(metadata.coretimeChain).tx.Broker.renew({
    core: coreToRenew,
  });

  const toastId = toast.loading('Transaction submitted');

  tx.signSubmitAndWatch(selectedAccount!.polkadotSigner).subscribe(
    (ev: any) => {
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
        if (!ev.ok) {
          toast.error('Transaction failed', { id: toastId });
        } else {
          toast.success('Transaction succeeded!', { id: toastId });
          getAccountData({ account: selectedAccount!.address, connections, network });
        }
      }
    },
    () => {
      toast.error('Transaction cancelled', { id: toastId });
    }
  );
};
