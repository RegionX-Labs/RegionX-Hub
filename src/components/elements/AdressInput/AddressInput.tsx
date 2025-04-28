// src/components/Input/Input.tsx
import React, { useState, useEffect } from 'react';
import styles from './adressinput.module.scss';
import Identicon from '@polkadot/react-identicon';

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state for styling
  leftIcon?: React.ReactNode; // Left icon for the input
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
  onFocus?: () => void; // Focus handler
  onBlur?: () => void; // Blur handler
}

const AddressInput: React.FC<InputProps> = ({
  label,
  value: controlledValue, // renamed value to controlledValue
  placeholder,
  disabled = false,
  error = false,
  leftIcon,
  onChange,
  onFocus,
  onBlur,
}) => {
  const [value, setValue] = useState(controlledValue || ''); // Local state for input value
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(controlledValue || ''); // Sync local value with controlledValue prop if it changes
  }, [controlledValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // Update local state
    if (onChange) {
      onChange(e); // Call parent onChange if provided
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

        {/* Conditionally render Identicon only when there is a value */}
        {value && (
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
