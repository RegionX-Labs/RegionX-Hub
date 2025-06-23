'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './select.module.scss';
import Input from '../AdressInput/AddressInput';
import DownArrow from '../../../../public/DownArrow.svg';
import { SelectOption } from '../../../types/type';
import Image from 'next/image';

interface SelectProps<T> {
  options: SelectOption<T | null>[];
  searchable?: boolean;
  onChange?: (value: T | null) => void;
  placeholder?: string;
  disabled?: boolean;
  selectedValue?: T | null;
  showOnlySelectedIcon?: boolean;
  variant?: 'default' | 'secondary';
}

const Select = <T,>({
  options,
  searchable = false,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  selectedValue = null,
  showOnlySelectedIcon = false,
  variant = 'default',
}: SelectProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<T | null>(selectedValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedValue) setSelected(selectedValue);
  }, [selectedValue]);

  const handleOptionClick = (value: T | null) => {
    setSelected(value);
    setIsDropdownOpen(false);
    if (onChange) onChange(value);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(
    (option) => JSON.stringify(option.value) === JSON.stringify(selected)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectClassName = `
    ${styles.selectBox}
    ${disabled ? styles['selectBox-disabled'] : ''}
    ${styles[`selectBox--${variant}`]}
  `;

  return (
    <div className={styles.selectWrapper} ref={dropdownRef}>
      <div
        className={selectClassName}
        onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedOption ? (
          <div className={styles.selectedOptionDisplay}>
            {selectedOption.icon}
            {!showOnlySelectedIcon && <span>{selectedOption.label}</span>}
          </div>
        ) : (
          placeholder
        )}
        <span className={styles['selectBox-arrow']}>
          <Image src={DownArrow} alt='Down Arrow' />
        </span>
      </div>

      {isDropdownOpen && !disabled && (
        <div className={`${styles.selectDropdown} ${styles[`selectDropdown--${variant}`]}`}>
          {searchable && (
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search...'
              disabled={disabled}
            />
          )}
          <ul className={styles['selectDropdown-optionList']}>
            {filteredOptions.map((option) => (
              <li
                key={option.key}
                onClick={() => handleOptionClick(option.value)}
                className={`${styles['selectDropdown-optionList-optionItem']} ${
                  option.value === selected ? styles.selected : ''
                }`}
              >
                {option.icon}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
