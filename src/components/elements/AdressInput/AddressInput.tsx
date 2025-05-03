import React, { useState, useEffect } from 'react';
import styles from './adressinput.module.scss';
import Identicon from '@polkadot/react-identicon';
import { validateAddress } from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  leftIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const AddressInput: React.FC<InputProps> = ({
  label,
  value: controlledValue,
  placeholder,
  disabled = false,
  error = false,
  leftIcon,
  onChange,
  onFocus,
  onBlur,
}) => {
  const [value, setValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setValue(controlledValue || '');
  }, [controlledValue]);

  useEffect(() => {
    setIsValid(checkValidAddress(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const checkValidAddress = (input: string) => {
    if (!input) return false;
    if (isHex(input)) return false;
    try {
      validateAddress(input);
      return true;
    } catch {
      return false;
    }
  };

  const inputClass = `${styles.inputField} ${disabled ? styles['inputField-disabled'] : ''} ${leftIcon ? styles['inputField-leftIcon'] : ''} ${
    error ? styles['inputField-error'] : ''
  } ${isFocused ? styles['inputField-focused'] : ''}`;

  return (
    <div className={styles['componentWrapper']}>
      {label && (
        <label
          className={`${styles['inputWrapper-label']} ${error ? styles['inputWrapper-error'] : ''}`}
        >
          {label}
        </label>
      )}
      <div
        className={`${styles.inputWrapper} ${disabled ? styles['inputWrapper-disabled'] : ''} ${error ? styles['inputWrapper-error'] : ''}`}
      >
        {leftIcon && !value && (
          <span
            className={`${styles['inputWrapper-icon-left']} ${isFocused ? styles['inputWrapper-icon-left-focused'] : ''}`}
          >
            {leftIcon}
          </span>
        )}

        {isValid && (
          <Identicon className={styles['inputWrapper-identicon']} value={value} size={30} />
        )}

        <input
          type='text'
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default AddressInput;
