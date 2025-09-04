'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  searchPlaceholder?: string;
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
  searchPlaceholder = 'Search...',
}: SelectProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<T | null>(selectedValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(selectedValue ?? null);
  }, [selectedValue]);

  const handleOptionClick = (value: T | null) => {
    setSelected(value);
    setIsDropdownOpen(false);
    onChange?.(value);
  };

  const term = searchTerm.trim().toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!term) return options;
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(term);
      const idMatch = typeof option.key === 'string' && option.key.toLowerCase().includes(term);
      return labelMatch || idMatch;
    });
  }, [options, term]);

  const selectedOption = useMemo(
    () =>
      options.find((option) => JSON.stringify(option.value) === JSON.stringify(selected)) ?? null,
    [options, selected]
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

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onKeyDownTop = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setIsDropdownOpen(false);
  };

  return (
    <div className={styles.selectWrapper} ref={dropdownRef} onKeyDown={onKeyDownTop}>
      <div
        className={selectClassName}
        onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
        role='button'
        aria-haspopup='listbox'
        aria-expanded={isDropdownOpen}
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
            <div style={{ padding: 8 }}>
              <Input
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                disabled={disabled}
              />
            </div>
          )}
          <ul className={styles['selectDropdown-optionList']} role='listbox'>
            {filteredOptions.length === 0 && (
              <li
                className={styles['selectDropdown-optionList-optionItem']}
                style={{ opacity: 0.7, cursor: 'default' }}
              >
                No results
              </li>
            )}
            {filteredOptions.map((option) => (
              <li
                key={option.key}
                onClick={() => handleOptionClick(option.value)}
                className={`${styles['selectDropdown-optionList-optionItem']} ${
                  option.value === selected ? styles.selected : ''
                }`}
                role='option'
                aria-selected={option.value === selected}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {option.icon}
                    <span style={{ marginLeft: 8 }}>{option.label}</span>
                  </div>
                  {option.extra && <div style={{ marginLeft: 12 }}>{option.extra}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
