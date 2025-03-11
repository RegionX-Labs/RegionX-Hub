import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Network } from '@/types';
import { regionsRequested } from '@/coretime/regions';

const MyRegionsPage = () => {
  const router = useRouter();
  const { network } = router.query;

  useEffect(() => {
    if (!network) return;

    let _network = Network.NONE;
    if (network === 'polkadot') _network = Network.POLKADOT;
    else if (network === 'kusama') _network = Network.KUSAMA;
    else if (network === 'paseo') _network = Network.PASEO;
    else if (network === 'rococo') _network = Network.ROCOCO;
    else if (network === 'westend') _network = Network.WESTEND;

    regionsRequested(_network);
  }, [network]);

  return (
    <div>
      <h1>MyRegions</h1>
      <p>This is the MyRegions.</p>
    </div>
  );
};

export default MyRegionsPage;
