import { Network } from '@/types';

// Network name used as the key for the server-side proxy.
const NETWORK_KEY: Partial<Record<Network, string>> = {
  [Network.POLKADOT]: 'polkadot',
  [Network.KUSAMA]: 'kusama',
  [Network.PASEO]: 'paseo',
  [Network.WESTEND]: 'westend',
};

export type SubscanResponse<T = any> = {
  code: number;
  message: string;
  data: T;
};

// Simple rate limiter: max 4 requests per second (under Subscan's 5/s limit).
const RATE_LIMIT_INTERVAL = 250; // ms between requests
let lastRequestTime = 0;

const waitForRateLimit = (): Promise<void> => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed >= RATE_LIMIT_INTERVAL) {
    lastRequestTime = now;
    return Promise.resolve();
  }
  const delay = RATE_LIMIT_INTERVAL - elapsed;
  lastRequestTime = now + delay;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// All Subscan requests go through our Next.js API route to avoid CORS issues.
export async function subscanFetch<T = any>(
  network: Network,
  endpoint: string,
  body: Record<string, any> = {}
): Promise<T | null> {
  const networkKey = NETWORK_KEY[network];
  if (!networkKey) return null;

  await waitForRateLimit();

  try {
    const res = await fetch('/api/subscan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ network: networkKey, endpoint, body }),
    });

    const json: SubscanResponse<T> = await res.json();
    if (!res.ok || json.code !== 0) return null;

    return json.data;
  } catch {
    return null;
  }
}
