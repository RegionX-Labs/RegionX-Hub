import { Network } from "@/types";
import { useRouter } from "next/router";
import {
  Kusama as KusamaIcon,
  Paseo as PaseoIcon,
  Polkadot as PolkadotIcon,
  Westend as WestendIcon,
} from '@/assets/networks/relay';
import { useUnit } from "effector-react";
import { $network, networkStarted } from "@/api/connection";

const NetworkSelector = () => {
    const router = useRouter();
    const network = useUnit($network); 

    const handleChange = (e: any) => {
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, network: e.target.value },
            },
            undefined,
            { shallow: false }
        );
        networkStarted(e.target.value);
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
