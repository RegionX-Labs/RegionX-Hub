import { $loadedAccounts, $selectedAccount, accountSelected } from "@/wallet";
import { useUnit } from "effector-react";
import { ChangeEvent } from "react";

const AccountSelector = () => {
    const accounts = useUnit($loadedAccounts);
    const selectedAccount = useUnit($selectedAccount);
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        accountSelected(e.target.value);
    }

    return (
        <div>
            <select id="network-select" name="network" onChange={handleChange}>
                {accounts.map(account => (
                    <option key={account.address} value={account.address}>{account.name + " " + account.address}</option>
                ))}
            </select>
            <p>Selected Account: {selectedAccount?.address}</p>
        </div>
    )
}

export default AccountSelector;
