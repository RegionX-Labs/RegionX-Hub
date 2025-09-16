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
  isOptionDisabled?: (value: T | null) => boolean;
  /** Optional custom comparator for complex values (fallback is JSON stringify) */
  valueEquals?: (a: T | null, b: T | null) => boolean;
}

const Select = <T,>({
  options,
  searchable = false, // default OFF unless you explicitly turn it on
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  selectedValue = null,
  showOnlySelectedIcon = false,
  variant = 'default',
  searchPlaceholder = 'Search...',
  isOptionDisabled,
  valueEquals,
}: SelectProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<T | null>(selectedValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDisabledValue = (v: T | null) => !!isOptionDisabled?.(v);

  // De-duplicate options by key (prevents repeated para IDs etc.)
  const uniqueOptions = useMemo(() => {
    const seen = new Set<string | number>();
    const out: SelectOption<T | null>[] = [];
    for (const opt of options) {
      if (opt == null) continue;
      const k = opt.key as string | number;
      if (k == null) continue;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(opt);
    }
    return out;
  }, [options]);

  // Keep local selected in sync with selectedValue, but clear if disabled
  useEffect(() => {
    if (isDisabledValue(selectedValue ?? null)) {
      setSelected(null);
    } else {
      setSelected(selectedValue ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, isOptionDisabled]);

  const equals = useMemo(() => {
    if (valueEquals) return valueEquals;
    // Safe fallback for tuples/POJOs used in your app
    return (a: T | null, b: T | null) => JSON.stringify(a) === JSON.stringify(b);
  }, [valueEquals]);

  const handleOptionClick = (value: T | null) => {
    if (isDisabledValue(value)) return;
    setSelected(value);
    setIsDropdownOpen(false);
    onChange?.(value);
  };

  const term = searchTerm.trim().toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!term) return uniqueOptions;
    return uniqueOptions.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(term);
      const keyStr =
        typeof option.key === 'string'
          ? option.key.toLowerCase()
          : String(option.key).toLowerCase();
      const idMatch = keyStr.includes(term);
      return labelMatch || idMatch;
    });
  }, [uniqueOptions, term]);

  const selectedOption = useMemo(
    () => uniqueOptions.find((option) => equals(option.value as T | null, selected)) ?? null,
    [uniqueOptions, selected, equals]
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
    ${styles['selectBox--' + variant]}
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
        <div className={`${styles.selectDropdown} ${styles['selectDropdown--' + variant]}`}>
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
            {filteredOptions.map((option) => {
              const isOptDisabled = isDisabledValue(option.value as T | null);
              const isSelected = equals(option.value as T | null, selected);

              return (
                <li
                  key={option.key}
                  onClick={() => handleOptionClick(option.value as T | null)}
                  className={`${styles['selectDropdown-optionList-optionItem']} ${
                    isSelected ? styles.selected : ''
                  } ${isOptDisabled ? styles['optionDisabled'] : ''}`}
                  role='option'
                  aria-selected={isSelected}
                  aria-disabled={isOptDisabled}
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
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
