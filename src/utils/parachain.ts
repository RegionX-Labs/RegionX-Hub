import { stringToU8a, bnToU8a } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

export enum ParaType {
  Sibling = 'sibl',
  Child = 'para',
}

export const paraIdToAddress = (paraId: number, type: ParaType): string => {
  const typePrefix = stringToU8a(type);
  const paraIdBytes = bnToU8a(paraId, { bitLength: 32, isLe: true });
  const zeroPadding = new Uint8Array(32 - typePrefix.length - paraIdBytes.length);

  const fullBytes = new Uint8Array([...typePrefix, ...paraIdBytes, ...zeroPadding]);
  return encodeAddress(fullBytes);
};
