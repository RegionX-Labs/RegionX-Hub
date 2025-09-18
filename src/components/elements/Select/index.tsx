'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './select.module.scss';
import Input from '../AdressInput/AddressInput';
import DownArrow from '../../../../public/DownArrow.svg';
import { SelectOption } from '../../../types/type';
import Image from 'next/image';

type FontConfig = {
  family?: string;
  size?: number | string;
  weight?: number | string;
  lineHeight?: number | string;
};

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
  valueEquals?: (a: T | null, b: T | null) => boolean;
  className?: string;
  font?: FontConfig;
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
  isOptionDisabled,
  valueEquals,
  className,
  font,
}: SelectProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<T | null>(selectedValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDisabledValue = (v: T | null) => !!isOptionDisabled?.(v);

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

  useEffect(() => {
    if (isDisabledValue(selectedValue ?? null)) {
      setSelected(null);
    } else {
      setSelected(selectedValue ?? null);
    }
  }, [selectedValue, isOptionDisabled]);

  const equals = useMemo(() => {
    if (valueEquals) return valueEquals;
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

  const cssVars: React.CSSProperties = {
    ['--select-font-family' as any]: font?.family,
    ['--select-font-size' as any]: typeof font?.size === 'number' ? `${font.size}px` : font?.size,
    ['--select-line-height' as any]:
      typeof font?.lineHeight === 'number' ? `${font.lineHeight}px` : font?.lineHeight,
    ['--select-font-weight' as any]: font?.weight as any,
  };

  return (
    <div
      className={`${styles.selectWrapper} ${className ?? ''}`}
      ref={dropdownRef}
      onKeyDown={onKeyDownTop}
      style={cssVars}
    >
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
