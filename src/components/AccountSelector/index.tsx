import { $loadedAccounts, $selectedAccount, accountSelected } from "@/wallet";
import { useUnit } from "effector-react";
import { Select } from "@region-x/components";
import styles from "./account.module.scss";

const AccountSelector = () => {
  const accounts = useUnit($loadedAccounts);

  const handleChange = (value: string | null) => {
    if (value) {
      accountSelected(value);
    }
  };

  const formatAddress = (address: string): string => {
    const formattedAddress = `${address.slice(
      0,
      4
    )}...${address.slice(-6)}`;

    return formattedAddress;
  }

  const options = accounts.map((account) => {
    return {
      value: account.address,
      label: `${formatAddress(account.address)} (${account.name})`,
    };
  });

  return (
    <div>
      <Select options={options} onChange={handleChange} />
    </div>
  );
};

export default AccountSelector;
