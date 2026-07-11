import type { NextApiRequest, NextApiResponse } from 'next';

const UPSTREAM_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 60_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;

const ALLOWED_ENDPOINTS = new Set(['/api/scan/broker/sale', '/api/v2/scan/extrinsics']);

type CachedResponse = { expiresAt: number; status: number; data: unknown };
const responseCache = new Map<string, CachedResponse>();
const inFlight = new Map<string, Promise<CachedResponse>>();
const requestCounts = new Map<string, { count: number; resetAt: number }>();

const ALLOWED_BASES: Record<string, string> = {
  polkadot: 'https://coretime-polkadot.api.subscan.io',
  kusama: 'https://coretime-kusama.api.subscan.io',
  paseo: 'https://coretime-paseo.api.subscan.io',
  westend: 'https://coretime-westend.api.subscan.io',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { network, endpoint, body } = req.body;

  const base = ALLOWED_BASES[network];
  if (!base || !endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Only allow /api/scan/ and /api/v2/scan/ paths.
  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]) ||
    req.socket.remoteAddress ||
    'unknown';
  const now = Date.now();
  const rate = requestCounts.get(clientIp);
  if (!rate || rate.resetAt <= now) {
    requestCounts.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (rate.count >= RATE_LIMIT_MAX) {
    res.setHeader('Retry-After', String(Math.ceil((rate.resetAt - now) / 1000)));
    return res.status(429).json({ error: 'Too many requests' });
  } else {
    rate.count += 1;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const apiKey = process.env.SUBSCAN_API_KEY || process.env.NEXT_PUBLIC_SUBSCAN_API_KEY;
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  try {
    const requestBody = JSON.stringify(body ?? {});
    if (requestBody.length > 10_000) return res.status(413).json({ error: 'Request too large' });

    const cacheKey = `${network}:${endpoint}:${requestBody}`;
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      res.setHeader('X-Subscan-Cache', 'HIT');
      return res.status(cached.status).json(cached.data);
    }

    let request = inFlight.get(cacheKey);
    if (!request) {
      request = (async () => {
        const upstream = await fetch(`${base}${endpoint}`, {
          method: 'POST',
          headers,
          body: requestBody,
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
        const data = await upstream.json();
        return { expiresAt: Date.now() + CACHE_TTL_MS, status: upstream.status, data };
      })();
      inFlight.set(cacheKey, request);
    }

    const result = await request;
    if (result.status >= 200 && result.status < 300) responseCache.set(cacheKey, result);
    res.setHeader('X-Subscan-Cache', cached ? 'STALE' : 'MISS');
    return res.status(result.status).json(result.data);
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    return res.status(timedOut ? 504 : 502).json({ error: 'Failed to reach Subscan' });
  } finally {
    const requestBody = JSON.stringify(body ?? {});
    inFlight.delete(`${network}:${endpoint}:${requestBody}`);
  }
}
