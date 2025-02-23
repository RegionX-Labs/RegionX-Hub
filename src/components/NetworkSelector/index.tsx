import { useNetwork } from "@/contexts/network";
import { Network } from "@/types";
import { useRouter } from "next/router";
import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
} from '@/assets/networks/relay';

const NetworkSelector = () => {
    const router = useRouter();
    const { network } = useNetwork();

    const handleChange = (e: any) => {
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, network: e.target.value },
            },
            undefined,
            { shallow: false }
        );
    };

    const networks = [
        {
            value: Network.POLKADOT,
            label: 'Polkadot',
            icon: PolkadotIcon,
        },
        {
            value: Network.KUSAMA,
            label: 'Kusama',
            icon: KusamaIcon,
        },
        {
            value: Network.PASEO,
            label: 'Paseo',
            icon: PaseoIcon,
        },
        {
            value: Network.WESTEND,
            label: 'Westend',
            icon: WestendIcon,
        },
    ];

    return (
        <div>
            <select id="network-select" name="network" onChange={handleChange} value={network}>
                {networks.map(network => (
                    <option key={network.value} value={network.value}>{network.label}</option>
                ))}
            </select>
        </div>
    )
}

export default NetworkSelector;
