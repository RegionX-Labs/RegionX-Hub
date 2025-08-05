export function maskToBin(mask: string): string {
  let bin = '';
  for (let i = 2; i < mask.length; ++i) {
    const v = parseInt(mask.slice(i, i + 1), 16);
    for (let j = 3; j >= 0; --j) {
      bin += v & (1 << j) ? '1' : '0';
    }
  }
  return bin;
}

export function bitStringToUint8Array(bits: string): Uint8Array {
  if (bits.length % 8 !== 0) {
    throw new Error('Bit string must be divisible by 8');
  }

  const bytes = new Uint8Array(bits.length / 8);
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    bytes[i / 8] = parseInt(byte, 2);
  }

  return bytes;
}

export const countBits = (regionMask: string) => {
  let count = 0;
  // Convert hex to bits and count ones.
  for (let i = 2; i < regionMask.length; ++i) {
    let v = parseInt(regionMask.slice(i, i + 1), 16);
    while (v > 0) {
      if (v & 1) ++count;
      v >>= 1;
    }
  }
  return count;
};
