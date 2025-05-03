import React, { useState, useEffect } from 'react';
import Select from '../Select';
import styles from './AmountInput.module.scss';
import { SelectOption } from '../../../types/type';

interface AmountInputProps {
  currencyOptions: SelectOption<string>[]; // Options for the currency selector
  onAmountChange?: (amount: string) => void; // Callback for amount input change
  onCurrencyChange?: (currency: string) => void; // Callback for currency change
  placeholder?: string;
  label?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  currencyOptions,
  onAmountChange,
  onCurrencyChange,
  placeholder = 'Enter amount',
  label,
}) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string | null>(null);

  useEffect(() => {
    if (currencyOptions.length > 0) {
      setCurrency(currencyOptions[0].value); // Automatically set the first option as selected
      if (onCurrencyChange) onCurrencyChange(currencyOptions[0].value);
    }
  }, [currencyOptions, onCurrencyChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and a period
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // Ensure it's a valid number or decimal
      setAmount(value);
      if (onAmountChange) onAmountChange(value);
    }
  };

  const handleCurrencyChange = (value: string | null) => {
    if (!value) return;
    setCurrency(value);
    if (onCurrencyChange) onCurrencyChange(value);
  };

  return (
    <div className={styles['amountInputWrapper']}>
      {label && <label className={styles['amountInputWrapper-label']}>{label}</label>}
      <div className={styles['amountInputWrapper-form']}>
        <Select
          options={currencyOptions}
          onChange={handleCurrencyChange}
          selectedValue={currency}
          searchable={true}
          showOnlySelectedIcon={true}
        />
        <input
          type='text'
          value={amount}
          onChange={handleAmountChange}
          placeholder={placeholder}
          className={styles['amountInputField']}
        />
      </div>
    </div>
  );
};

export default AmountInput;
