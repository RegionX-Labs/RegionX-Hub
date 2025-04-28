import React from 'react';

export interface SelectOption<T> {
  key: string;
  value: T;
  label: string;
  icon?: React.ReactElement;
}

export interface RegionData {
  name: string;
  regionStart: string;
  regionEnd: string;
  coreIndex: number;
  duration: string;
  coreOcupaccy: number;
  consumed: number;
  currentUsage?: number | undefined;
  chainLabel: string;
  chainColor:
    | 'yellowDark'
    | 'greenDark'
    | 'orangeDark'
    | 'pinkDark'
    | 'cyan'
    | 'redDark'
    | 'purpleDark'
    | 'teal'
    | 'blueDark'
    | 'gray6'
    | 'dark5'
    | 'gray5'
    | 'greenPrimary';
  onClick?: () => void;
  onUnlist?: () => void;
  onPurchase?: () => void;
}

export type TableData = {
  cellType: 'text' | 'link' | 'address' | 'jsx';
  data: string | React.ReactElement;
  link?: string;
  // A custom search key. Mainly useful for `jsx` cells since we can't usually do
  // a regular search with them.
  searchKey?: string;
};

export interface TableProps {
  data: Array<Record<string, TableData>>;
  pageSize: number;
  disableSearch?: boolean;
}
