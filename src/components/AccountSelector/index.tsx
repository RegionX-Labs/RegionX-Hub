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

  const options = accounts.map((account) => {
    const formattedAddress = `${account.address.slice(
      0,
      4
    )}...${account.address.slice(-6)}`;
    return {
      value: account.address,
      label: `${formattedAddress} (${account.name})`,
    };
  });

  return (
    <div>
      <Select options={options} onChange={handleChange} />
    </div>
  );
};

export default AccountSelector;
